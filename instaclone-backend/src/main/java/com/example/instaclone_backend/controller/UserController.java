package com.example.instaclone_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.instaclone_backend.dto.UserDto;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.security.JwtUtil;
import com.example.instaclone_backend.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "https://instaclone-three-swart.vercel.app"})
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        User user = getCurrentUser();
        UserDto userDto = userService.getUserProfile(user.getId(), user.getId());
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId) {
        User currentUser = getCurrentUser();
        UserDto userDto = userService.getUserProfile(userId, currentUser.getId());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto userDto) {
        User currentUser = getCurrentUser();

        User updatedUser = userService.updateUserProfile(currentUser.getId(), userDto);
        UserDto updatedUserDto = userService.getUserProfile(updatedUser.getId(), updatedUser.getId());

        return ResponseEntity.ok(updatedUserDto);
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long userId) {
        User currentUser = getCurrentUser();
        userService.followUser(currentUser.getId(), userId);
        return ResponseEntity.ok("User followed successfully");
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<String> unfollowUser(@PathVariable Long userId) {
        User currentUser = getCurrentUser();
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

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserDto>> getSuggestions() {
        User currentUser = getCurrentUser();
        List<UserDto> suggestions = userService.getSuggestions(currentUser.getId());
        return ResponseEntity.ok(suggestions);
    }
}
