
SET NAMES utf8mb4;

CREATE DATABASE `vueshop`;

USE `vueshop`;


# 管理员表

CREATE TABLE `vueshop_admin` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
    `username` VARCHAR(255) UNIQUE NOT NULL COMMENT '用户名',
    `password` CHAR(32) DEFAULT ''  NOT NULL COMMENT '密码',
    `salt` VARCHAR(32) DEFAULT '' NOT NULL COMMENT '密码盐',
    `avatar` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '用户头像'
) ENGINE=InnoDB CHARSET=utf8mb4;

INSERT INTO `vueshop_admin` VALUES 
(1, 'admin', MD5(CONCAT(MD5('123456'), 'ItCast')), 'ItCast', ''),
(2, 'demo', MD5(CONCAT(MD5('123456'), 'ItCast')), 'ItCast', '');


# 用户表

CREATE TABLE `vueshop_user` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
    `username` VARCHAR(255) UNIQUE NOT NULL COMMENT '用户名',
    `password` CHAR(32) DEFAULT '' NOT NULL COMMENT '密码',
    `salt` VARCHAR(32) DEFAULT '' NOT NULL COMMENT '密码盐',
    `avatar` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '用户头像'
) ENGINE = InnoDB CHARSET = utf8mb4;

INSERT INTO `vueshop_user` VALUES 
(1, 'demo1', MD5(CONCAT(MD5('123456'), 'ItCast')), 'ItCast', ''),
(2, 'demo2', MD5(CONCAT(MD5('123456'), 'ItCast')), 'ItCast', '');


# 分类表

CREATE TABLE `vueshop_category` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '分类id',
    `name` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '分类名称',
    `picture` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '分类图片',
    `pid` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '上级分类id'
) ENGINE=InnoDB CHARSET=utf8mb4;

INSERT INTO `vueshop_category` VALUES
(1, '潮流女装', '', 0),
(2, '羽绒服', 'static/image/category/clothes/jackets.png', 1),
(3, '毛呢大衣', 'static/image/category/clothes/overcoat.jpg', 1),
(4, '连衣裙', 'static/image/category/clothes/dress.png', 1),
(5, '食品', '', 0),
(6, '休闲零食', 'static/image/category/foods/biscuit.jpg', 5),
(7, '生鲜果蔬', 'static/image/category/foods/tomato.jpg', 5),
(8, '饮料汽水', 'static/image/category/foods/drinks.jpg', 5),
(9, '四季茗茶', 'static/image/category/foods/tea.jpg', 5),
(10, '粮油调味', 'static/image/category/foods/oil.jpg', 5),   
(11, '珠宝配饰', '', 0),
(12, '时尚饰品', 'static/image/category/jewelry/ornaments.jpg', 11),
(13, '品质手表', 'static/image/category/jewelry/watch.jpg', 11),
(14, 'DIY饰品', 'static/image/category/jewelry/diy.jpg', 11),
(15, '日用百货', '', 0),
(16, '居家日用', 'static/image/category/store/towel.png', 15),
(17, '个人清洁', 'static/image/category/store/paper.png', 15),
(18, '盆碗碟筷', 'static/image/category/store/bowl.png', 15),
(19, '茶杯茶具', 'static/image/category/store/cup.png', 15),
(20, '收纳整理', 'static/image/category/store/box.png', 15), 
(21, '手机数码', '', 0),
(22, '手机', 'static/image/category/phone/phone.png', 21),
(23, '笔记本', 'static/image/category/phone/computer.png', 21),
(24, '数码配件', 'static/image/category/phone/headset.png', 21),
(25, '平板', 'static/image/category/phone/flat.png', 21),
(26, '相机', 'static/image/category/phone/camera.png', 21), 
(27, '户外运动', '', 0),
(28, '运动鞋', 'static/image/category/motion/shoes.jpg', 27),
(29, '球类运动', 'static/image/category/motion/ball.png', 27),
(30, '垂钓用品', 'static/image/category/motion/fishingrod.png', 27),
(31, '运动服', 'static/image/category/motion/clothes.png', 27),
(32, '骑行装备', 'static/image/category/motion/bicycle.png', 27),
(33, '电动车', 'static/image/category/motion/vehicle.png', 27);


# 商品表

CREATE TABLE `vueshop_goods` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '商品id',
    `category_id` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '分类id ',
    `name` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '商品名称',
    `price` DECIMAL(10, 2) DEFAULT 0 NOT NULL COMMENT '商品价格',
    `picture` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '商品图片',
    `stock` INT DEFAULT 0 NOT NULL COMMENT '商品库存',
    `spec` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '商品规格', 
    `description` MEDIUMTEXT NOT NULL COMMENT '商品简介'
) ENGINE=InnoDB CHARSET=utf8mb4;


INSERT INTO `vueshop_goods` VALUES
(1, 7, '葡萄柚', 10.00, 'static/image/goods/grapefruit.png', 10, '大果 300g','葡萄柚含有丰富的蛋白质、维生素、叶酸、无机盐、纤维素等等。'),
(2, 7, '葡萄', 10.00, 'static/image/goods/grape.png', 20, '一级果（净重4.5斤）','葡萄含有大量的维生素C，丰富的矿物质，日常食用，可以抗氧化、起到美容养颜的作用，并且还能提高机体抵抗力、辅助降血压、降血糖、预防心脑血管疾病。'),
(3, 7, '西红柿', 3.00, 'static/image/goods/tomatoes.png', 20, '5斤装','西红柿属于常见的水果，不仅美味，还营养丰富，具有美容养颜、保护视力等功效。'),
(4, 7, '生菜', 6.00, 'static/image/goods/lettuce.png', 20, '1斤装','生菜可生食，脆嫩爽口，略甜，具有改善睡眠、减肥瘦身、保护视力等功效。'),
(5, 7, '菠菜', 4.00, 'static/image/goods/spinach.png', 50, '1斤装','菠菜富含类胡萝卜素、维生素C、维生素K，具有保护视力、美容养颜、缓解贫血、通肠导便的功效。'),
(6, 7, '脐橙', 8.00, 'static/image/goods/orange.png', 50, '1斤装', '赣南脐橙，江西省赣州市特产，中国国家地理标志产品。'),
(7, 7, '香菇', 8.00, 'static/image/goods/mushroom.jpg', 500, '1斤装','香菇肉质肥厚细嫩，味道鲜美，香气独特，营养丰富，是一种食药同源的食物，具有很高的营养、药用和保健价值。'),
(8, 7, '进口香蕉', 2.00, 'static/image/goods/banana.jpeg', 60, '约250g，2根','香蕉为芭蕉科植物甘蕉的果实，果肉香甜，除可生食外，还可制成多种加工品。'),
(9, 7, '陕西蜜梨', 6.90, 'static/image/goods/pear.jpeg', 30, '约600g','梨味美汁多、甜中带酸，而且营养丰富，含有多种维生素、纤维素等，既能生吃，也可以煮水或煲汤后食用。'),
(10, 7, '加力果', 26.80, 'static/image/goods/apple.jpeg', 19, '约680g/3个','<div>
<div>加力果属于苹果的一种，只是普通水果，功效主要是提供营养物质。另外加力果富含膳食纤维，还具有预防和改善便秘的作用。</div>
<div><img src="http://127.0.0.1:8360/static/image/goods/detail/apple1.jpg" alt="商品详情1" width="1280" height="1982"><img src="http://127.0.0.1:8360/static/image/goods/detail/apple2.jpg" alt="商品详情2" width="1280" height="1712"><img src="http://127.0.0.1:8360/static/image/goods/detail/apple3.jpg" alt="商品详情3" width="1280" height="1982"></div>
</div>');


# 商品轮播图

CREATE TABLE `vueshop_goods_album` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '图片id',
    `goods_id` INT UNSIGNED NOT NULL COMMENT '商品id',
    `picture` VARCHAR(255) DEFAULT '' NOT NULL COMMENT '商品图片'
) ENGINE=InnoDB CHARSET=utf8mb4;

INSERT INTO `vueshop_goods_album` VALUES
(1, 10, 'static/image/goods/album/apple1.jpg'),
(2, 10, 'static/image/goods/album/apple2.jpg'),
(3, 7, 'static/image/goods/spinach.png'),
(4, 7, 'static/image/goods/spinach.png');
