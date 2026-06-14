package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateUserRequest;
import rw.gov.inteko.backend.dto.request.UpdateUserRequest;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.exception.DuplicateResourceException;
import rw.gov.inteko.backend.repository.*;
import rw.gov.inteko.backend.mapper.UserMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }
        
        if (userRepository.existsByIdNumber(request.getIdNumber())) {
            throw new DuplicateResourceException("ID number already exists: " + request.getIdNumber());
        }
        
        User user = User.builder()
                .userCode(generateUserCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .idNumber(request.getIdNumber())
                .phone(request.getPhone())
                .position(request.getPosition())
                .role(request.getRole())
                .permissions(request.getPermissions())
                .status(UserStatus.ACTIVE)
                .build();
        
        if (request.getSectorId() != null) {
            user.setSector(sectorRepository.findById(request.getSectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sector not found")));
        }
        
        if (request.getCellId() != null) {
            user.setCell(cellRepository.findById(request.getCellId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cell not found")));
        }
        
        if (request.getVillageId() != null) {
            user.setVillage(villageRepository.findById(request.getVillageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Village not found")));
        }
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        
        return userMapper.toResponse(savedUser);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponse(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllActiveUsers()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchUsers(keyword, pageable)
                .map(userMapper::toResponse);
    }
    
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getPosition() != null) user.setPosition(request.getPosition());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        
        User updatedUser = userRepository.save(user);
        log.info("User updated successfully");
        
        return userMapper.toResponse(updatedUser);
    }
    
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE);
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User status toggled to: {}", user.getStatus());
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User soft deleted with ID: {}", id);
    }
    
    private String generateUserCode() {
        long count = userRepository.count() + 1;
        return String.format("U-%03d", count);
    }
}
