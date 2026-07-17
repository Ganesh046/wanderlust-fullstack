package com.ganesh.wanderlustBackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ganesh.wanderlustBackend.exception.ImageUploadException;
import com.ganesh.wanderlustBackend.model.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Image uploadImage(MultipartFile image)  {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "wanderlustImgs");

            Map<String,Object> uploadResult = cloudinary.uploader().upload(image.getBytes(),options);

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            return new Image(url, publicId);
        } catch (IOException e) {
            throw new ImageUploadException("Failed to upload image");
        }
    }

    public void deleteImage(String publicId){
        try{
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new ImageUploadException("Failed to delete image");
        }
    }
}
