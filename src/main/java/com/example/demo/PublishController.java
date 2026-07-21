package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class PublishController {

    private final PageService pageService;

    public PublishController(PageService pageService) {
        this.pageService = pageService;
    }

    @PostMapping("/publish")
    public PublishResponse publish() {
        return pageService.publish();
    }

    @GetMapping("/publish/history")
    public List<PublishedVersion> history() {
        return pageService.getPublishHistory();
    }
}