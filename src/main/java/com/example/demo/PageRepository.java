package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PageRepository extends JpaRepository<Page, Long> {

    @Query(value = "SELECT * FROM pages WHERE LOWER(title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(content) LIKE LOWER(CONCAT('%', :query, '%'))", nativeQuery = true)
    List<Page> searchByTitleOrContent(@Param("query") String query);
}