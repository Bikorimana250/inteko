package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateMeetingRequest;
import rw.gov.inteko.backend.dto.response.MeetingResponse;
import rw.gov.inteko.backend.entity.Meeting;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.MeetingRepository;
import rw.gov.inteko.backend.repository.SectorRepository;
import rw.gov.inteko.backend.mapper.MeetingMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MeetingService {
    
    private final MeetingRepository meetingRepository;
    private final SectorRepository sectorRepository;
    private final MeetingMapper meetingMapper;
    
    @Transactional
    public MeetingResponse createMeeting(CreateMeetingRequest request) {
        log.info("Creating new meeting: {}", request.getTitle());
        
        var sector = sectorRepository.findById(request.getSectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector not found"));
        
        Meeting meeting = Meeting.builder()
                .meetingCode(generateMeetingCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .meetingDate(request.getMeetingDate())
                .meetingTime(request.getMeetingTime())
                .location(request.getLocation())
                .targetCount(request.getTargetCount())
                .status(MeetingStatus.SCHEDULED)
                .sector(sector)
                .participantsCount(0)
                .build();
        
        Meeting savedMeeting = meetingRepository.save(meeting);
        log.info("Meeting created with code: {}", savedMeeting.getMeetingCode());
        
        return meetingMapper.toResponse(savedMeeting);
    }
    
    public MeetingResponse getMeetingById(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found with ID: " + id));
        return meetingMapper.toResponse(meeting);
    }
    
    public List<MeetingResponse> getAllMeetings() {
        return meetingRepository.findAllActiveMeetings()
                .stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<MeetingResponse> getUpcomingMeetings() {
        return meetingRepository.findUpcomingMeetings(LocalDate.now())
                .stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<MeetingResponse> getMeetingsByStatus(MeetingStatus status) {
        return meetingRepository.findByStatus(status)
                .stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public MeetingResponse updateMeetingStatus(Long id, MeetingStatus status) {
        log.info("Updating meeting {} status to {}", id, status);
        
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found with ID: " + id));
        
        meeting.setStatus(status);
        
        if (status == MeetingStatus.COMPLETED && meeting.getParticipantsCount() == 0) {
            int simulatedCount = (int) (meeting.getTargetCount() * (0.75 + Math.random() * 0.2));
            meeting.setParticipantsCount(simulatedCount);
        }
        
        Meeting updatedMeeting = meetingRepository.save(meeting);
        return meetingMapper.toResponse(updatedMeeting);
    }
    
    private String generateMeetingCode() {
        long count = meetingRepository.count() + 89;
        return String.format("#MTG-2023-%03d", count);
    }
}
