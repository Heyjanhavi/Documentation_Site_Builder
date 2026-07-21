package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "published_versions")
public class PublishedVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer version;

    @Column(name = "published_date")
    private LocalDateTime publishedDate;

    @Lob
    @Column(name = "snapshot", columnDefinition = "LONGTEXT")
    private String snapshot;

    @Column(name = "page_count")
    private Integer pageCount;

    @PrePersist
    protected void onCreate() {
        publishedDate = LocalDateTime.now();
    }

    public PublishedVersion() {}

    public PublishedVersion(Integer version, String snapshot, Integer pageCount) {
        this.version = version;
        this.snapshot = snapshot;
        this.pageCount = pageCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }

    public String getSnapshot() { return snapshot; }
    public void setSnapshot(String snapshot) { this.snapshot = snapshot; }

    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }
}
