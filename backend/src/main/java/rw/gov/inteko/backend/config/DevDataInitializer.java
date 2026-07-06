package rw.gov.inteko.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.entity.Sector;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;
import rw.gov.inteko.backend.repository.SectorRepository;
import rw.gov.inteko.backend.repository.UserRepository;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("[Dev] Seed data already present, skipping.");
            return;
        }

        log.info("[Dev] Seeding development data...");

        // Sectors
        Sector kinyinya = seedSector("SEC-001", "Kinyinya", "Kinyinya Sector in Gasabo District");
        Sector remera   = seedSector("SEC-002", "Remera",   "Remera Sector in Gasabo District");
        Sector kimironko = seedSector("SEC-003", "Kimironko", "Kimironko Sector in Gasabo District");

        String hash = passwordEncoder.encode("password123");

        // Admin
        seedUser("U-001", "Admin", "System", "admin@inteko.gov.rw",
                hash, "1198780012345678", "+250788123456",
                "System Administrator", UserRole.ADMINISTRATOR, "ALL", null);

        // Sector Officials
        seedUser("U-002", "Jean Paul", "Uwimana", "jp.uwimana@kinyinya.gov.rw",
                hash, "1198780012345679", "+250788234567",
                "Sector Executive Secretary", UserRole.SECTOR_OFFICIAL, "SECTOR_MANAGE", kinyinya);

        seedUser("U-003", "Claudine", "Mukasine", "c.mukasine@remera.gov.rw",
                hash, "1198780012345680", "+250788345678",
                "Sector Executive Secretary", UserRole.SECTOR_OFFICIAL, "SECTOR_MANAGE", remera);

        seedUser("U-004", "Emmanuel", "Nsabimana", "e.nsabimana@kimironko.gov.rw",
                hash, "1198780012345681", "+250788456789",
                "Sector Executive Secretary", UserRole.SECTOR_OFFICIAL, "SECTOR_MANAGE", kimironko);

        // Meeting Secretaries
        seedUser("U-005", "Marie", "Uwera", "m.uwera@kinyinya.gov.rw",
                hash, "1198780012345682", "+250788567890",
                "Meeting Secretary", UserRole.MEETING_SECRETARY, "MEETING_MANAGE", kinyinya);

        seedUser("U-006", "Patrick", "Habimana", "p.habimana@remera.gov.rw",
                hash, "1198780012345683", "+250788678901",
                "Meeting Secretary", UserRole.MEETING_SECRETARY, "MEETING_MANAGE", remera);

        seedUser("U-007", "Grace", "Mukeshimana", "g.mukeshimana@kimironko.gov.rw",
                hash, "1198780012345684", "+250788789012",
                "Meeting Secretary", UserRole.MEETING_SECRETARY, "MEETING_MANAGE", kimironko);

        log.info("[Dev] Seed complete. Login with any seeded email and password: password123");
    }

    private Sector seedSector(String code, String name, String description) {
        return sectorRepository.findBySectorCode(code).orElseGet(() -> {
            Sector s = new Sector();
            s.setSectorCode(code);
            s.setName(name);
            s.setDescription(description);
            return sectorRepository.save(s);
        });
    }

    private void seedUser(String code, String firstName, String lastName, String email,
                          String hash, String idNumber, String phone, String position,
                          UserRole role, String permissions, Sector sector) {
        if (userRepository.existsByEmail(email)) return;
        User u = User.builder()
                .userCode(code)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .passwordHash(hash)
                .idNumber(idNumber)
                .phone(phone)
                .position(position)
                .role(role)
                .permissions(permissions)
                .status(UserStatus.ACTIVE)
                .sector(sector)
                .build();
        userRepository.save(u);
        log.info("[Dev] Seeded user: {} ({})", email, role);
    }
}
