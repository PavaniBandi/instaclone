package com.example.instaclone_backend.repository;

import com.example.instaclone_backend.entity.Post;
import com.example.instaclone_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user IN (SELECT f FROM User u JOIN u.following f WHERE u.id = :userId) ORDER BY p.createdAt DESC")
    Page<Post> findPostsFromFollowedUsers(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user IN (SELECT f FROM User u JOIN u.following f WHERE u.id = :userId) OR p.user.id = :userId ORDER BY p.createdAt DESC")
    Page<Post> findPostsFromFollowedUsersAndCurrentUser(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Post> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
} 