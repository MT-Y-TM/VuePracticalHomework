# 后台接口

## 通用

### 文件上传

POST `/admin/upload/picture`

`Content-Type`: multipart/formdata

- `type` 图片类型，可选值如下。
  - `admin_avatar` 管理员头像
  - `category_picture` 分类图
  - `goods_picture` 商品图
  - `goods_album` 商品轮播图
  - `goods_description` 商品描述图
- `name` 设为固定值 file

## 管理员

### 管理员登录

POST `/admin/login`

- `username` 用户名
- `password` 密码

### 获取管理员信息

GET `/admin/admin`

### 修改管理员密码

POST `/admin/admin/changePassword`

- `password` 密码

### 修改管理员头像

POST `/admin/admin/changeAvatar`

- `avatar` 头像路径

## 分类

### 查询分类列表

GET `/admin/category/list`

### 查询单个分类

GET `/admin/category`

- `id` 分类 id

### 添加分类

POST `/admin/category/add`

- `name` 分类名称
- `picture` 分类图片
- `pid` 分类上级 id，0 表示无

### 修改分类

POST `/admin/category/save`

- `id` 分类 id
- `name` 分类名称
- `picture` 分类图片
- `pid` 分类上级 id，0 表示无

### 删除分类

POST `/admin/category/del`

- `id` 分类 id

## 商品

### 查询商品列表

GET `/admin/goods/list`

### 查询单个商品

GET `/admin/goods`

- `id` 商品 id

### 添加商品

POST `/admin/goods/add`

- `category_id` 分类 id
- `name` 商品名称
- `price` 商品价格
- `description` 商品简介
- `picture` 商品图片
- `spec` 商品规格
- `stock` 商品库存
- `album` 商品相册（数组）

### 修改商品

POST `/admin/goods/save`

- `id` 商品 id
- `category_id` 分类 id
- `name` 商品名称
- `price` 商品价格
- `description` 商品简介
- `picture` 商品图片
- `spec` 商品规格
- `stock` 商品库存
- `album` 商品相册（数组）

### 删除商品

POST `/admin/goods/del`

- `id` 商品 id


# 前台接口

## 用户

### 用户登录

POST `/home/login`

- `username` 用户名 
- `password` 密码

### 用户注册

POST `/home/register`

- `username` 用户名 
- `password` 密码

### 获取用户信息

GET `/home/user`

## 商品

### 商品分类列表

GET `/home/category/list`

### 商品列表

GET `/home/goods/list`

- `last_id` 查询指定id之后的数据
- `pagesize` 每页显示的条数
- `category_id` 分类id

### 商品详情

GET `/home/goods/detail`

- `id` 商品id

### 商品相册

GET `/home/goods/album`

- `goods_id` 商品id

### 商品购物车

GET `/home/goods/cart`

- `ids` 商品id字符串，多个id用“,”分隔
