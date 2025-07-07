package com.example.instaclone_backend.service;

import com.example.instaclone_backend.dto.PostDto;
import com.example.instaclone_backend.dto.CommentDto;
import com.example.instaclone_backend.entity.Post;
import com.example.instaclone_backend.entity.User;
import com.example.instaclone_backend.entity.Comment;
import com.example.instaclone_backend.repository.PostRepository;
import com.example.instaclone_backend.repository.CommentRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserService userService;
    
    public Post createPost(Post post) {
        return postRepository.save(post);
    }
    
    public PostDto getPostById(Long postId, Long currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        return convertToDto(post, currentUserId);
    }
    
    public Page<PostDto> getFeed(Long currentUserId, Pageable pageable) {
        // Get posts from followed users AND current user's own posts
        Page<Post> posts = postRepository.findPostsFromFollowedUsersAndCurrentUser(currentUserId, pageable);
        return posts.map(post -> convertToDto(post, currentUserId));
    }
    
    public Page<PostDto> getUserPosts(Long userId, Long currentUserId, Pageable pageable) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Page<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return posts.map(post -> convertToDto(post, currentUserId));
    }
    
    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!post.isLikedBy(user)) {
            post.addLike(user);
            postRepository.save(post);
        }
    }
    
    public void unlikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (post.isLikedBy(user)) {
            post.removeLike(user);
            postRepository.save(post);
        }
    }
    
    public Comment addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        
        return commentRepository.save(comment);
    }
    

    
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cannot delete another user's post");
        }
        
        commentRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }
    
    private PostDto convertToDto(Post post, Long currentUserId) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUsername(post.getUser().getUsername());
        dto.setUserProfilePicture(post.getUser().getProfilePicture());
        dto.setCaption(post.getCaption());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikesCount(post.getLikesCount());
        dto.setCommentsCount(post.getCommentsCount());
        
        // Convert comments to DTOs
        List<CommentDto> commentDtos = post.getComments().stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
        dto.setComments(commentDtos);
        
        if (currentUserId != null) {
            User currentUser = userService.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                dto.setIsLiked(post.isLikedBy(currentUser));
            }
        }
        
        return dto;
    }
    
    private CommentDto convertCommentToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setUserProfilePicture(comment.getUser().getProfilePicture());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
    

    

} 