        package com.example.backend.repository;

        import org.springframework.data.jpa.repository.JpaRepository;

        import com.example.backend.entity.Links;
        import java.util.List;


        public interface LinksRepo extends JpaRepository<Links, Long> {
                List<Links> findByUserId(Long userId);
                Links findByUserIdAndPlatform(Long userId, String platform);
        }
