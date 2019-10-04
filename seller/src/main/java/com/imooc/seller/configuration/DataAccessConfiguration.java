package com.imooc.seller.configuration;

import com.imooc.entity.Order;
import com.imooc.seller.repositories.OrderRepository;
import com.imooc.seller.repositoriesbackup.VerifyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.LinkedHashMap;
import java.util.Map;

/*
* db operation config
* */
@Configuration
public class DataAccessConfiguration {
    @Autowired
    private JpaProperties properties;

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.primary")
    public DataSource primaryDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.backup")
    public DataSource backupDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("primaryDataSource") DataSource dataSource){
        return builder
                .dataSource(dataSource)
                .packages(Order.class)
                .properties((getVendorProperties(dataSource)))
                .persistenceUnit("primary")
                .build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean backupEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("backupDataSource") DataSource dataSource){
        return builder
                .dataSource(dataSource)
                .packages(Order.class)
                .properties((getVendorProperties(dataSource)))
                .persistenceUnit("backup")
                .build();
    }

    @Bean
    @Primary
    public PlatformTransactionManager primaryTransactionManager(@Qualifier("primaryEntityManagerFactory") LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory){
        JpaTransactionManager transactionManager = new JpaTransactionManager(primaryEntityManagerFactory.getObject());
        return transactionManager;
    }

    @Bean
    public PlatformTransactionManager backupTransactionManager(@Qualifier("backupEntityManagerFactory") LocalContainerEntityManagerFactoryBean backupEntityManagerFactory){
        JpaTransactionManager transactionManager = new JpaTransactionManager(backupEntityManagerFactory.getObject());
        return transactionManager;
    }
    //repository scan, it doesn't sure about which one got scanned first, see source code. solution：put primary and backup in different packages
    @EnableJpaRepositories(basePackageClasses = OrderRepository.class,
            entityManagerFactoryRef = "primaryEntityManagerFactory", transactionManagerRef = "primaryTransactionManager")
    public class PrimaryConfiguration{
    }

    @EnableJpaRepositories(basePackageClasses = VerifyRepository.class,
            entityManagerFactoryRef = "backupEntityManagerFactory", transactionManagerRef = "backupTransactionManager")
    public class BackupConfiguration{
    }


    protected Map<String, Object> getVendorProperties(DataSource dataSource){
        Map<String, Object> vendorProperties = new LinkedHashMap<>();
        vendorProperties.putAll(properties.getHibernateProperties(dataSource));
        return vendorProperties;
    }
}
