package com.example.instaclone_backend.controller;

import com.example.instaclone_backend.dto.AuthRequest;
import com.example.instaclone_backend.dto.AuthResponse;
import com.example.instaclone_backend.dto.UserDto;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.service.UserService;
import com.example.instaclone_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            
            // Generate token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", createdUser.getId());
            claims.put("email", createdUser.getEmail());
            claims.put("role", "USER");
            
            String token = jwtUtil.generateToken(createdUser.getEmail(), claims);
            
            // Convert to DTO
            UserDto userDto = userService.getUserProfile(createdUser.getId(), null);
            
            AuthResponse response = new AuthResponse(token, "User registered successfully", userDto);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(null, "Registration failed: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Generate token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("email", user.getEmail());
            claims.put("role", "USER");
            
            String token = jwtUtil.generateToken(user.getEmail(), claims);
            
            // Convert to DTO
            UserDto userDto = userService.getUserProfile(user.getId(), null);
            
            AuthResponse response = new AuthResponse(token, "Login successful", userDto);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(null, "Login failed: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (jwtUtil.isTokenValid(jwt)) {
                String email = jwtUtil.extractUsername(jwt);
                User user = userService.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                response.put("valid", true);
                response.put("user", userService.getUserProfile(user.getId(), null));
                return ResponseEntity.ok(response);
            }
        }
        
        response.put("valid", false);
        response.put("message", "Invalid token");
        return ResponseEntity.ok(response);
    }
} 