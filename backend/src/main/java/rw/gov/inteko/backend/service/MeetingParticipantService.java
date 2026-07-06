package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.AddParticipantRequest;
import rw.gov.inteko.backend.dto.response.MeetingParticipantResponse;
import rw.gov.inteko.backend.entity.Meeting;
import rw.gov.inteko.backend.entity.MeetingParticipant;
import rw.gov.inteko.backend.entity.enums.AttendanceStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.mapper.MeetingParticipantMapper;
import rw.gov.inteko.backend.repository.MeetingParticipantRepository;
import rw.gov.inteko.backend.repository.MeetingRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MeetingParticipantService {
    private final MeetingParticipantRepository participantRepository;
    private final MeetingParticipantMapper participantMapper;
    private final MeetingRepository meetingRepository;

    public List<MeetingParticipantResponse> getParticipantsByMeetingId(Long meetingId) {
        return participantRepository.findByMeetingId(meetingId).stream()
                .map(participantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long countPresent(Long meetingId) {
        return participantRepository.countPresentByMeetingId(meetingId);
    }

    @Transactional
    public MeetingParticipantResponse addParticipant(Long meetingId, AddParticipantRequest request) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));

        MeetingParticipant participant = MeetingParticipant.builder()
                .meeting(meeting)
                .participantName(request.getParticipantName())
                .idNumber(request.getIdNumber())
                .phone(request.getPhone())
                .attendanceStatus(AttendanceStatus.PRESENT)
                .checkedInAt(LocalDateTime.now())
                .build();

        MeetingParticipant saved = participantRepository.save(participant);

        // Keep participantsCount in sync
        meeting.setParticipantsCount(meeting.getParticipantsCount() + 1);
        meetingRepository.save(meeting);

        log.info("Checked in '{}' for meeting {}", request.getParticipantName(), meetingId);
        return participantMapper.toResponse(saved);
    }
}
