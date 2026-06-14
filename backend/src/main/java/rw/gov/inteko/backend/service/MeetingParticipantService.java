package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.MeetingParticipantResponse;
import rw.gov.inteko.backend.entity.MeetingParticipant;
import rw.gov.inteko.backend.mapper.MeetingParticipantMapper;
import rw.gov.inteko.backend.repository.MeetingParticipantRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MeetingParticipantService {
    private final MeetingParticipantRepository participantRepository;
    private final MeetingParticipantMapper participantMapper;

    public List<MeetingParticipantResponse> getParticipantsByMeetingId(Long meetingId) {
        return participantRepository.findByMeetingId(meetingId).stream()
                .map(participantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long countPresent(Long meetingId) {
        return participantRepository.countPresentByMeetingId(meetingId);
    }
}
