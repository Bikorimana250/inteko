package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateResolutionRequest;
import rw.gov.inteko.backend.dto.response.ResolutionResponse;
import rw.gov.inteko.backend.entity.Resolution;
import rw.gov.inteko.backend.entity.ResolutionActionItem;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.*;
import rw.gov.inteko.backend.mapper.ResolutionMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResolutionService {
    
    private final ResolutionRepository resolutionRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final ResolutionMapper resolutionMapper;
    
    @Transactional
    public ResolutionResponse createResolution(CreateResolutionRequest request) {
        log.info("Creating new resolution: {}", request.getTitle());
        
        Resolution resolution = Resolution.builder()
                .resolutionCode(generateResolutionCode())
                .title(request.getTitle())
                .summary(request.getSummary())
                .assignedUnit(request.getAssignedUnit())
                .responsibleOfficer(request.getResponsibleOfficer())
                .status(ResolutionStatus.ACTIVE)
                .progressPercentage(0)
                .dueDate(request.getDueDate())
                .build();
        
        if (request.getLinkedIssueId() != null) {
            resolution.setLinkedIssue(issueRepository.findById(request.getLinkedIssueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Issue not found")));
        }
        
        if (request.getAssignedToUserId() != null) {
            resolution.setAssignedTo(userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        }
        
        Resolution savedResolution = resolutionRepository.save(resolution);
        log.info("Resolution created with code: {}", savedResolution.getResolutionCode());
        
        return resolutionMapper.toResponse(savedResolution);
    }
    
    public ResolutionResponse getResolutionById(Long id) {
        Resolution resolution = resolutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resolution not found with ID: " + id));
        return resolutionMapper.toResponse(resolution);
    }
    
    public List<ResolutionResponse> getAllResolutions() {
        return resolutionRepository.findAllActiveResolutions()
                .stream()
                .map(resolutionMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<ResolutionResponse> getResolutionsByStatus(ResolutionStatus status) {
        return resolutionRepository.findByStatus(status)
                .stream()
                .map(resolutionMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<ResolutionResponse> getOverdueResolutions() {
        return resolutionRepository.findOverdueResolutions(LocalDate.now())
                .stream()
                .map(resolutionMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ResolutionResponse toggleActionItem(Long resolutionId, Long itemId) {
        Resolution resolution = resolutionRepository.findById(resolutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Resolution not found"));
        
        ResolutionActionItem item = resolution.getActionItems().stream()
                .filter(ai -> ai.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Action item not found"));
        
        item.setIsCompleted(!item.getIsCompleted());
        if (item.getIsCompleted()) {
            item.setCompletedAt(LocalDateTime.now());
        } else {
            item.setCompletedAt(null);
        }
        
        resolution.calculateProgress();
        Resolution savedResolution = resolutionRepository.save(resolution);
        
        return resolutionMapper.toResponse(savedResolution);
    }
    
    @Transactional
    public ResolutionResponse addComment(Long resolutionId, String commentText) {
        Resolution resolution = resolutionRepository.findById(resolutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Resolution not found"));
        
        rw.gov.inteko.backend.security.UserPrincipal principal = 
            (rw.gov.inteko.backend.security.UserPrincipal) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        rw.gov.inteko.backend.entity.User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        rw.gov.inteko.backend.entity.ResolutionComment comment = rw.gov.inteko.backend.entity.ResolutionComment.builder()
                .resolution(resolution)
                .commentText(commentText)
                .authorName(user.getFullName())
                .authorRole(user.getRole().name())
                .createdBy(principal.getId())
                .build();
        
        resolution.getComments().add(comment);
        Resolution updatedResolution = resolutionRepository.save(resolution);
        
        return resolutionMapper.toResponse(updatedResolution);
    }
    
    @Transactional
    public ResolutionResponse concludeResolution(Long resolutionId) {
        Resolution resolution = resolutionRepository.findById(resolutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Resolution not found"));
        
        resolution.setStatus(ResolutionStatus.CONCLUDED);
        resolution.setConcludedAt(LocalDateTime.now());
        
        Resolution concludedResolution = resolutionRepository.save(resolution);
        return resolutionMapper.toResponse(concludedResolution);
    }
    
    private String generateResolutionCode() {
        long count = resolutionRepository.count() + 1;
        return String.format("R-%02d", count);
    }
}
