package com.stockportfolio.backend.controller;

import com.stockportfolio.backend.model.Portfolio;
import com.stockportfolio.backend.security.JwtUtil;
import com.stockportfolio.backend.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        return jwtUtil.extractEmail(token);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addStock(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody Portfolio portfolio) {
        try {
            String email = extractEmail(authHeader);
            Portfolio saved = portfolioService.addStock(portfolio, email);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getPortfolio(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmail(authHeader);
            List<Portfolio> portfolio = portfolioService.getPortfolio(email);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStock(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long id) {
        try {
            portfolioService.deleteStock(id);
            return ResponseEntity.ok(Map.of("message", "Stock deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
