package com.example.instaclone_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.security.JwtUtil;
import com.example.instaclone_backend.service.UserService;

import lombok.Data;

@CrossOrigin(origins = {"http://localhost:5173", "https://instaclone-three-swart.vercel.app"})
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .build();
        userService.registerUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean valid = userService.validateCredentials(request.getEmail(), request.getPassword());
        if (!valid) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User user = userService.findByEmail(request.getEmail()).get();
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        String token = jwtUtil.generateToken(user.getEmail(), claims);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName());
        response.put("id", user.getId());
        return ResponseEntity.ok(response);
    }

    @Data
    public static class SignupRequest {

        private String username;
        private String email;
        private String password;
        private String fullName;
    }

    @Data
    public static class LoginRequest {

        private String email;
        private String password;
    }
}
