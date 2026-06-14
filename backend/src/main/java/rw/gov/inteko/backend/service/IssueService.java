package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateIssueRequest;
import rw.gov.inteko.backend.dto.response.IssueResponse;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssueStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.*;
import rw.gov.inteko.backend.mapper.IssueMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import rw.gov.inteko.backend.entity.IssueComment;
import rw.gov.inteko.backend.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IssueService {
    
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;
    private final IssueMapper issueMapper;
    private final NotificationService notificationService;
    
    @Transactional
    public IssueResponse addComment(Long issueId, String commentText) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        IssueComment comment = IssueComment.builder()
                .issue(issue)
                .commentText(commentText)
                .createdBy(principal.getId())
                .build();
        
        issue.getComments().add(comment);
        Issue updatedIssue = issueRepository.save(issue);
        
        return issueMapper.toResponse(updatedIssue);
    }
    
    @Transactional
    public IssueResponse createIssue(CreateIssueRequest request) {
        log.info("Creating new issue: {}", request.getTitle());
        
        Issue issue = Issue.builder()
                .issueCode(generateIssueCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(IssueStatus.ACTIVE)
                .reporterName(request.getReporterName())
                .reporterPhone(request.getReporterPhone())
                .reporterIdNumber(request.getReporterIdNumber())
                .build();
        
        if (request.getSectorId() != null) {
            issue.setSector(sectorRepository.findById(request.getSectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sector not found")));
        }
        
        if (request.getCellId() != null) {
            issue.setCell(cellRepository.findById(request.getCellId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cell not found")));
        }
        
        if (request.getVillageId() != null) {
            issue.setVillage(villageRepository.findById(request.getVillageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Village not found")));
        }
        
        Issue savedIssue = issueRepository.save(issue);
        log.info("Issue created with code: {}", savedIssue.getIssueCode());
        
        notificationService.createIssueNotification(savedIssue);
        
        return issueMapper.toResponse(savedIssue);
    }
    
    public IssueResponse getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + id));
        return issueMapper.toResponse(issue);
    }
    
    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAllActiveIssues()
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<IssueResponse> getIssuesByCategory(IssueCategory category) {
        return issueRepository.findByCategory(category)
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<IssueResponse> getIssuesByStatus(IssueStatus status) {
        return issueRepository.findByStatus(status)
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<IssueResponse> getIssuesByAssignedUser(Long userId) {
        return issueRepository.findByAssignedTo(userId)
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Page<IssueResponse> searchIssues(String keyword, Pageable pageable) {
        return issueRepository.searchIssues(keyword, pageable)
                .map(issueMapper::toResponse);
    }
    
    @Transactional
    public IssueResponse assignIssue(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        issue.setAssignedTo(user);
        issue.setAssignedAt(LocalDateTime.now());
        issue.setStatus(IssueStatus.PROCESSING);
        
        Issue updatedIssue = issueRepository.save(issue);
        return issueMapper.toResponse(updatedIssue);
    }
    
    @Transactional
    public IssueResponse resolveIssue(Long issueId, String resolutionSummary) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        issue.setStatus(IssueStatus.RESOLVED);
        issue.setResolvedAt(LocalDateTime.now());
        issue.setResolutionSummary(resolutionSummary);
        
        Issue resolvedIssue = issueRepository.save(issue);
        return issueMapper.toResponse(resolvedIssue);
    }
    
    private String generateIssueCode() {
        long count = issueRepository.count() + 1;
        return String.format("I-%02d", count);
    }
}
