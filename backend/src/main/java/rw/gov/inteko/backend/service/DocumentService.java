package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.DocumentResponse;
import rw.gov.inteko.backend.entity.Document;
import rw.gov.inteko.backend.entity.enums.AccessLevel;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.mapper.DocumentMapper;
import rw.gov.inteko.backend.repository.DocumentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    public List<DocumentResponse> getAllActiveDocuments() {
        return documentRepository.findAllActiveDocuments().stream()
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Page<DocumentResponse> searchDocuments(String keyword, Pageable pageable) {
        return documentRepository.searchDocuments(keyword, pageable)
                .map(documentMapper::toResponse);
    }

    public DocumentResponse getDocumentByCode(String code) {
        Document document = documentRepository.findByDocumentCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with code: " + code));
        return documentMapper.toResponse(document);
    }

    public List<DocumentResponse> getDocumentsByCategory(String category) {
        return documentRepository.findByCategory(category).stream()
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void incrementDownloadCount(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        document.incrementDownloadCount();
        documentRepository.save(document);
    }
}
