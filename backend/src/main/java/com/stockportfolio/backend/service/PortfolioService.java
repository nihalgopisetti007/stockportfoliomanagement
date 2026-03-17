package com.stockportfolio.backend.service;

import com.stockportfolio.backend.model.Portfolio;
import com.stockportfolio.backend.model.User;
import com.stockportfolio.backend.repository.PortfolioRepository;
import com.stockportfolio.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    public Portfolio addStock(Portfolio portfolio, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        portfolio.setUser(user);
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPortfolio(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return portfolioRepository.findByUserId(user.getId());
    }

    public void deleteStock(Long id) {
        portfolioRepository.deleteById(id);
    }
}
