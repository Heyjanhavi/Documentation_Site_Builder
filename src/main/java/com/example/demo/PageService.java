package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final PublishedVersionRepository publishedVersionRepository;

    public PageService(PageRepository pageRepository, PublishedVersionRepository publishedVersionRepository) {
        this.pageRepository = pageRepository;
        this.publishedVersionRepository = publishedVersionRepository;
    }

    public List<Page> getAllPages() { return pageRepository.findAll(); }

    public Optional<Page> getPageById(Long id) { return pageRepository.findById(id); }

    public Page createPage(Page page) { return pageRepository.save(page); }

    public Optional<Page> updatePage(Long id, Page updated) {
        return pageRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setContent(updated.getContent());
            return pageRepository.save(existing);
        });
    }

    public boolean deletePage(Long id) {
        if (!pageRepository.existsById(id)) return false;
        pageRepository.deleteById(id);
        return true;
    }

    public List<SearchResult> search(String query) {
        List<Page> matches = pageRepository.searchByTitleOrContent(query);
        return matches.stream()
                .map(p -> new SearchResult(p.getId(), p.getTitle(), buildSnippet(p.getContent(), query)))
                .collect(Collectors.toList());
    }

    private String buildSnippet(String content, String query) {
        if (content == null || content.isEmpty()) return "";
        String lowerContent = content.toLowerCase();
        String lowerQuery = query.toLowerCase();
        int idx = lowerContent.indexOf(lowerQuery);
        if (idx == -1) {
            return content.length() > 120 ? content.substring(0, 120) + "..." : content;
        }
        int start = Math.max(0, idx - 40);
        int end = Math.min(content.length(), idx + query.length() + 80);
        String snippet = content.substring(start, end);
        return (start > 0 ? "..." : "") + snippet + (end < content.length() ? "..." : "");
    }

    public PublishResponse publish() {
        List<Page> allPages = pageRepository.findAll();
        int nextVersion = publishedVersionRepository.findTopByOrderByVersionDesc()
                .map(v -> v.getVersion() + 1)
                .orElse(1);

        String snapshot = allPages.stream()
                .map(p -> "{\"title\":\"" + escapeJson(p.getTitle()) + "\",\"content\":\"" + escapeJson(p.getContent()) + "\"}")
                .collect(Collectors.joining(",", "[", "]"));

        PublishedVersion pv = new PublishedVersion(nextVersion, snapshot, allPages.size());
        publishedVersionRepository.save(pv);

        allPages.forEach(p -> {
            p.setVersion(nextVersion);
            pageRepository.save(p);
        });

        return new PublishResponse(pv.getVersion(), pv.getPublishedDate(), pv.getPageCount(),
                "Successfully published version " + nextVersion);
    }

    public List<PublishedVersion> getPublishHistory() {
        return publishedVersionRepository.findAllByOrderByVersionDesc();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}