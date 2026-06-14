package rw.gov.inteko.backend.entity.enums;

public enum UserRole {
    ADMINISTRATOR("Administrator"),
    SECTOR_OFFICIAL("Sector Official"),
    MEETING_SECRETARY("Meeting Secretary");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
