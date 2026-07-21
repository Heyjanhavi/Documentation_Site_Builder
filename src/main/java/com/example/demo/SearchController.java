package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.List;

@RestController
public class SearchController {

    private final PageService pageService;

    public SearchController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/search")
    public List<SearchResult> search(@RequestParam(required = false) String q) {
        if (q == null || q.trim().isEmpty()) return Collections.emptyList();
        return pageService.search(q.trim());
    }
}