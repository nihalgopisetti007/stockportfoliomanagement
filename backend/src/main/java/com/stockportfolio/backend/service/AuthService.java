package com.stockportfolio.backend.service;

import com.stockportfolio.backend.model.User;
import com.stockportfolio.backend.repository.UserRepository;
import com.stockportfolio.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, String> register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return Map.of("message", "User registered successfully");
    }

    public Map<String, String> login(String email, String password) {
        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty() || !passwordEncoder.matches(password, optUser.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(email);
        return Map.of("token", token);
    }
}
