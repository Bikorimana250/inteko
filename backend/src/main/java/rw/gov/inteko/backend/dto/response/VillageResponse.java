package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VillageResponse {
    private Long id;
    private String villageCode;
    private String name;
    private String cellName;
    private String leaderName;
    private Integer population;
}
