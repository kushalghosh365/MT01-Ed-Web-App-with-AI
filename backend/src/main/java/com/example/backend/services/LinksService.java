package com.example.backend.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Links;
import com.example.backend.repository.LinksRepo;

@Service
public class LinksService {

    @Autowired
    private LinksRepo linksRepo;

    public Links getLinksByUserIdAndPlatform(Long userId, String platform) {
        return linksRepo.findByUserIdAndPlatform(userId, platform);
    }
}

