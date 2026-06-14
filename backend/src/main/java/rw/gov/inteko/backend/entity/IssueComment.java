package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_comments")
public class IssueComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;
    
    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    private String commentText;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    public IssueComment() {
    }

    public IssueComment(Long id, Issue issue, String commentText, LocalDateTime createdAt, Long createdBy) {
        this.id = id;
        this.issue = issue;
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static IssueCommentBuilder builder() {
        return new IssueCommentBuilder();
    }

    public static class IssueCommentBuilder {
        private Long id;
        private Issue issue;
        private String commentText;
        private LocalDateTime createdAt;
        private Long createdBy;

        public IssueCommentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public IssueCommentBuilder issue(Issue issue) {
            this.issue = issue;
            return this;
        }

        public IssueCommentBuilder commentText(String commentText) {
            this.commentText = commentText;
            return this;
        }

        public IssueCommentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public IssueCommentBuilder createdBy(Long createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public IssueComment build() {
            return new IssueComment(id, issue, commentText, createdAt, createdBy);
        }
    }
}
