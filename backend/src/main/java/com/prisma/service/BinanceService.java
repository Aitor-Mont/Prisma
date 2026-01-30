package com.prisma.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.lang.NonNull;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@RequiredArgsConstructor
public class BinanceService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void connectToBinance() {
        WebSocketClient client = new StandardWebSocketClient();
        try {
            client.execute(new TextWebSocketHandler() {
                @Override
                public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {

                    try {
                        String payload = message.getPayload();
                        // Parse simple JSON from Binance (e.g., {"p": "price", "s": "BTCUSDT", ...})
                        // For now detailed parsing is skipped to just relay the message
                        JsonNode node = objectMapper.readTree(payload);

                        // We are interested in 'p' (price) and 'E' (event time) mainly
                        // But let's just forward the whole node or a simplified object
                        messagingTemplate.convertAndSend("/topic/market", node);

                    } catch (Exception e) {
                        log.error("Error processing message", e);
                    }
                }
            }, "wss://stream.binance.com:9443/ws/btcusdt@trade").get();

            log.info("Connected to Binance WebSocket!");
        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to connect to Binance", e);
        }
    }
}
