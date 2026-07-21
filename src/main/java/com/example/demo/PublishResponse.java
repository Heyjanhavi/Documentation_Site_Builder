package com.example.demo;

import java.time.LocalDateTime;

public class PublishResponse {
    private Integer version;
    private LocalDateTime publishedDate;
    private Integer pageCount;
    private String message;

    public PublishResponse(Integer version, LocalDateTime publishedDate, Integer pageCount, String message) {
        this.version = version;
        this.publishedDate = publishedDate;
        this.pageCount = pageCount;
        this.message = message;
    }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}