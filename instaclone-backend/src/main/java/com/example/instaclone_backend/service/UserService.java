package com.example.instaclone_backend.service;

import com.example.instaclone_backend.dto.UserDto;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.repository.UserRepository;
import com.example.instaclone_backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public UserDto getUserProfile(Long userId, Long currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto userDto = convertToDto(user);
        userDto.setPostsCount(postRepository.countByUserId(userId).intValue());
        
        if (currentUserId != null && !currentUserId.equals(userId)) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                userDto.setIsFollowing(currentUser.getFollowing().contains(user));
            }
        }
        
        return userDto;
    }
    
    public User updateUserProfile(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }
        if (userDto.getBio() != null) {
            user.setBio(userDto.getBio());
        }
        if (userDto.getProfilePicture() != null) {
            user.setProfilePicture(userDto.getProfilePicture());
        }
        
        return userRepository.save(user);
    }
    
    public void followUser(Long currentUserId, Long userToFollowId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User userToFollow = userRepository.findById(userToFollowId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        
        if (currentUserId.equals(userToFollowId)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        
        currentUser.addFollowing(userToFollow);
        userToFollow.addFollower(currentUser);
        
        userRepository.save(currentUser);
        userRepository.save(userToFollow);
    }
    
    public void unfollowUser(Long currentUserId, Long userToUnfollowId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User userToUnfollow = userRepository.findById(userToUnfollowId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));
        
        currentUser.removeFollowing(userToUnfollow);
        userToUnfollow.removeFollower(currentUser);
        
        userRepository.save(currentUser);
        userRepository.save(userToUnfollow);
    }
    
    public List<UserDto> getFollowers(Long userId) {
        List<User> followers = userRepository.findFollowersByUserId(userId);
        return followers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> getFollowing(Long userId) {
        List<User> following = userRepository.findFollowingByUserId(userId);
        return following.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> searchUsers(String searchTerm) {
        List<User> users = userRepository.searchUsers(searchTerm);
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> getSuggestions(Long currentUserId) {
        User currentUser = findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        List<User> allUsers = userRepository.findAll();
        
        // Filter out current user and already followed users
        List<User> suggestions = allUsers.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(user -> !currentUser.getFollowing().contains(user))
                .collect(Collectors.toList());
        
        return suggestions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setFollowersCount(user.getFollowersCount());
        dto.setFollowingCount(user.getFollowingCount());
        return dto;
    }
} 