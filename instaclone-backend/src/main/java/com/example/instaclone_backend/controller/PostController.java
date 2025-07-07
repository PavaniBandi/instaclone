package com.example.instaclone_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.instaclone_backend.dto.PostDto;
import com.example.instaclone_backend.entity.Post;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.service.PostService;
import com.example.instaclone_backend.service.UserService;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = {"http://localhost:5173", "https://instaclone-three-swart.vercel.app"})
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody Post post) {
        User user = getCurrentUser();

        post.setUser(user);
        Post createdPost = postService.createPost(post);
        PostDto postDto = postService.getPostById(createdPost.getId(), user.getId());

        return ResponseEntity.ok(postDto);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostDto>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDto> posts = postService.getFeed(user.getId(), pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        User user = getCurrentUser();
        PostDto post = postService.getPostById(postId, user.getId());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostDto>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDto> posts = postService.getUserPosts(userId, currentUser.getId(), pageable);

        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId) {
        User user = getCurrentUser();
        postService.likePost(postId, user.getId());
        return ResponseEntity.ok("Post liked successfully");
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<String> unlikePost(@PathVariable Long postId) {
        User user = getCurrentUser();
        postService.unlikePost(postId, user.getId());
        return ResponseEntity.ok("Post unliked successfully");
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<String> addComment(
            @PathVariable Long postId,
            @RequestBody String content) {

        User user = getCurrentUser();
        postService.addComment(postId, user.getId(), content);
        return ResponseEntity.ok("Comment added successfully");
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        User user = getCurrentUser();
        postService.deletePost(postId, user.getId());
        return ResponseEntity.ok("Post deleted successfully");
    }
}
