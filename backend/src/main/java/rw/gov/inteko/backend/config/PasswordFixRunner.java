package rw.gov.inteko.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.repository.UserRepository;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class PasswordFixRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String SEED_PASSWORD = "password123";
    private static final String[] SEED_CODES = {
        "U-001", "U-002", "U-003", "U-004", "U-005", "U-006", "U-007"
    };

    @Override
    public void run(String... args) {
        String correctHash = passwordEncoder.encode(SEED_PASSWORD);

        for (String code : SEED_CODES) {
            userRepository.findByUserCode(code).ifPresent(user -> {
                if (!passwordEncoder.matches(SEED_PASSWORD, user.getPasswordHash())) {
                    user.setPasswordHash(correctHash);
                    userRepository.save(user);
                    log.info("[PasswordFix] Re-encoded password for user: {}", user.getEmail());
                }
            });
        }
    }
}
