package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PublishedVersionRepository extends JpaRepository<PublishedVersion, Long> {
    List<PublishedVersion> findAllByOrderByVersionDesc();
    Optional<PublishedVersion> findTopByOrderByVersionDesc();
}