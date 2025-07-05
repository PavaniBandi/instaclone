package com.example.instaclone_backend.repository;

import com.example.instaclone_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:searchTerm% OR u.fullName LIKE %:searchTerm%")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT f.id FROM User u2 JOIN u2.followers f WHERE u2.id = :userId)")
    List<User> findFollowersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT f.id FROM User u2 JOIN u2.following f WHERE u2.id = :userId)")
    List<User> findFollowingByUserId(@Param("userId") Long userId);
} 