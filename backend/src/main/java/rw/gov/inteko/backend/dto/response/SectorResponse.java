package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SectorResponse {
    private Long id;
    private String sectorCode;
    private String name;
    private String description;
    private Integer cellCount;
}
