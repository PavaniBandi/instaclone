package com.example.instaclone_backend.controller;

import com.example.instaclone_backend.dto.UserDto;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.service.UserService;
import com.example.instaclone_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto userDto = userService.getUserProfile(user.getId(), user.getId());
        return ResponseEntity.ok(userDto);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto userDto = userService.getUserProfile(userId, currentUser.getId());
        return ResponseEntity.ok(userDto);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto userDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User updatedUser = userService.updateUserProfile(currentUser.getId(), userDto);
        UserDto updatedUserDto = userService.getUserProfile(updatedUser.getId(), updatedUser.getId());
        
        return ResponseEntity.ok(updatedUserDto);
    }
    
    @PostMapping("/{userId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userService.followUser(currentUser.getId(), userId);
        return ResponseEntity.ok("User followed successfully");
    }
    
    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<String> unfollowUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userService.unfollowUser(currentUser.getId(), userId);
        return ResponseEntity.ok("User unfollowed successfully");
    }
    
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserDto>> getFollowers(@PathVariable Long userId) {
        List<UserDto> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }
    
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserDto>> getFollowing(@PathVariable Long userId) {
        List<UserDto> following = userService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String q) {
        List<UserDto> users = userService.searchUsers(q);
        return ResponseEntity.ok(users);
    }
} 