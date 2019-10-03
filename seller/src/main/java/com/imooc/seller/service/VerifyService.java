package com.imooc.seller.service;

import com.imooc.seller.repositories.VerifyRepository;
import org.aspectj.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/*
* Reconsiliation service
* */
@Service
public class VerifyService {
    @Autowired
    private VerifyRepository verifyRepository;

    @Value("${verification.rootdir:rootDir/opt/verification}")
    private String rootDir;

    private static String END_LINE = System.getProperty("line.separator", "\n");
    private static DateFormat DAY_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    /**
    *生成某个渠道某天的对账文件
    * @param chanId
     * @param day
     * @return
    * */
    public File makeVerificationFile(String chanId, Date day){
        File path = getPath(chanId, day);
        if(path.exists()){
            return path;
        }
        try{
            path.createNewFile();
        }catch(IOException e){
            e.printStackTrace();
        }
        //Construct start time and end time
        String start_str = DAY_FORMAT.format(day);
        Date start = null;
        try {
            start = DAY_FORMAT.parse(start_str);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        Date end = new Date(start.getTime() + 1000 * 60 * 60 * 24);
        List<String> orders = verifyRepository.queryVerificationOrders(chanId, start, end);
        String content = String.join(END_LINE, orders);
        FileUtil.writeAsString(path,content);
        return path;
    }

    public File getPath(String chanId, Date day){
        String name = DAY_FORMAT.format(day) + "-" + chanId + ".txt";
        File path = Paths.get(rootDir, name).toFile();
        return path;
    }
}
