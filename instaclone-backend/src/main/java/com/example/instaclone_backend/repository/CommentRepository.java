package com.example.instaclone_backend.repository;

import com.example.instaclone_backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    
    void deleteByPostId(Long postId);
} 