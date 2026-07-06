package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AddParticipantRequest {

    @NotBlank(message = "Participant name is required")
    private String participantName;

    private String idNumber;
    private String phone;

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
