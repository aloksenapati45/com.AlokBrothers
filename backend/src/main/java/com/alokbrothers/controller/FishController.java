package com.alokbrothers.controller;

import com.alokbrothers.model.Fish;
import com.alokbrothers.repository.FishRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fish")
public class FishController {
    private final FishRepository fishRepository;
    public FishController(FishRepository repo){this.fishRepository=repo;}

    @GetMapping
    public List<Fish> list(@RequestParam(required = false) String category){
        if(category!=null) return fishRepository.findByCategory(category);
        return fishRepository.findAll();
    }

    @PostMapping
    public Fish create(@RequestBody Fish fish){
        return fishRepository.save(fish);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        fishRepository.deleteById(id);
    }
}
