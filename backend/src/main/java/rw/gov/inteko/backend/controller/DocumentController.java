package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.DocumentResponse;
import rw.gov.inteko.backend.service.DocumentService;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getAllActiveDocuments() {
        return ResponseEntity.ok(ApiResponse.success(documentService.getAllActiveDocuments()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<DocumentResponse>>> searchDocuments(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(documentService.searchDocuments(keyword, pageable)));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentByCode(code)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocumentsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentsByCategory(category)));
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<ApiResponse<Void>> incrementDownloadCount(@PathVariable Long id) {
        documentService.incrementDownloadCount(id);
        return ResponseEntity.ok(ApiResponse.success("Download count incremented", null));
    }
}
