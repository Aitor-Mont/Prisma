package com.prisma.controller;

import com.prisma.entity.Transaction;
import com.prisma.repository.TransactionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUserId(@PathVariable UUID userId) {
        return transactionRepository.findByUserId(userId);
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}
