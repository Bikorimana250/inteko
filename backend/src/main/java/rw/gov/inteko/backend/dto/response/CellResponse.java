package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CellResponse {
    private Long id;
    private String cellCode;
    private String name;
    private String sectorName;
    private Integer villageCount;
}
