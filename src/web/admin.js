document.addEventListener('DOMContentLoaded', function () {
    // Mô phỏng danh sách người dùng với thông tin chi tiết (20 dữ liệu)
    // locked: 'Bình thường' | 'Cảnh báo' | 'Bị khóa'
    // Nếu là shop (Người bán) thì có thêm thuộc tính shopAddress và danh sách sản phẩm
    const users = [
        {
            name: 'Nguyễn Đức Thành',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'ndt@example.com',
            phone: '0123 456 789',
            address: 'Hà Nội',
            products: [] // Không có sản phẩm
        },
        {
            name: 'Nguyễn Văn Thành',
            locked: 'Cảnh báo',
            role: 'Người bán',
            email: 'ducthanh16904@gmail.com',
            phone: '0974832596',
            address: 'Trung Hưng - Sơn Tây - Hà Nội',
            shopAddress: 'Shop ABC, Quận Thanh Xuân, Hà Nội',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+1',
                    name: 'Sách Trăm năm cô đơn',
                    price: '200.000đ',
                    description: 'Mô tả cho sách Trăm năm cô đơn'
                },
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+2',
                    name: 'Sách ABC XYZ',
                    price: '150.000đ',
                    description: 'Mô tả cho sách ABC XYZ'
                }
            ]
        },
        {
            name: 'Trần AA',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'tran.aa@example.com',
            phone: '0905 123 456',
            address: 'Đà Nẵng',
            products: []
        },
        {
            name: 'Lê BB',
            locked: 'Bị khóa',
            role: 'Người bán',
            email: 'le.bb@example.com',
            phone: '0988 888 888',
            address: 'TP. HCM',
            shopAddress: 'Shop XYZ, Quận 1, TP. HCM',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+3',
                    name: 'Sản phẩm 1',
                    price: '300.000đ',
                    description: 'Mô tả cho sản phẩm 1'
                },
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+4',
                    name: 'Sản phẩm 2',
                    price: '350.000đ',
                    description: 'Mô tả cho sản phẩm 2'
                }
            ]
        },
        {
            name: 'Phạm Văn C',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'phamvc@example.com',
            phone: '0123 987 654',
            address: 'Hà Nội',
            products: []
        },
        {
            name: 'Đỗ Thị D',
            locked: 'Cảnh báo',
            role: 'Người dùng',
            email: 'dothid@example.com',
            phone: '0987 654 321',
            address: 'Hà Nội',
            products: []
        },
        {
            name: 'Hoàng Minh E',
            locked: 'Bình thường',
            role: 'Người bán',
            email: 'hoangmine@example.com',
            phone: '0912 345 678',
            address: 'TP. HCM',
            shopAddress: 'Shop Minh, Quận 3, TP. HCM',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+5',
                    name: 'Sản phẩm E1',
                    price: '250.000đ',
                    description: 'Mô tả cho sản phẩm E1'
                },
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+6',
                    name: 'Sản phẩm E2',
                    price: '275.000đ',
                    description: 'Mô tả cho sản phẩm E2'
                }
            ]
        },
        {
            name: 'Trần Văn F',
            locked: 'Bị khóa',
            role: 'Người bán',
            email: 'tranvf@example.com',
            phone: '0932 111 222',
            address: 'Hà Nội',
            shopAddress: 'Shop F, Quận 5, Hà Nội',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+7',
                    name: 'Sản phẩm F1',
                    price: '180.000đ',
                    description: 'Mô tả cho sản phẩm F1'
                }
            ]
        },
        {
            name: 'Lê Thị G',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'lethig@example.com',
            phone: '0942 333 444',
            address: 'Đà Nẵng',
            products: []
        },
        {
            name: 'Vũ Thanh H',
            locked: 'Cảnh báo',
            role: 'Người bán',
            email: 'vuthanhh@example.com',
            phone: '0952 555 666',
            address: 'TP. HCM',
            shopAddress: 'Shop Thanh, Quận 7, TP. HCM',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+8',
                    name: 'Sản phẩm H1',
                    price: '400.000đ',
                    description: 'Mô tả cho sản phẩm H1'
                },
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+9',
                    name: 'Sản phẩm H2',
                    price: '420.000đ',
                    description: 'Mô tả cho sản phẩm H2'
                }
            ]
        },
        {
            name: 'Ngô Quốc I',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'ngoqi@example.com',
            phone: '0962 777 888',
            address: 'Hải Phòng',
            products: []
        },
        {
            name: 'Bùi Văn J',
            locked: 'Bị khóa',
            role: 'Người bán',
            email: 'buivanj@example.com',
            phone: '0972 999 000',
            address: 'Hà Nội',
            shopAddress: 'Shop J, Quận Cầu Giấy, Hà Nội',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+10',
                    name: 'Sản phẩm J1',
                    price: '500.000đ',
                    description: 'Mô tả cho sản phẩm J1'
                }
            ]
        },
        {
            name: 'Trịnh Thị K',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'trinhk@example.com',
            phone: '0123 444 555',
            address: 'TP. HCM',
            products: []
        },
        {
            name: 'Phạm Thị L',
            locked: 'Cảnh báo',
            role: 'Người bán',
            email: 'phamthil@example.com',
            phone: '0981 222 333',
            address: 'Hà Nội',
            shopAddress: 'Shop L, Quận Hoàn Kiếm, Hà Nội',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+11',
                    name: 'Sản phẩm L1',
                    price: '320.000đ',
                    description: 'Mô tả cho sản phẩm L1'
                }
            ]
        },
        {
            name: 'Lý Văn M',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'lyvanm@example.com',
            phone: '0901 333 777',
            address: 'Đà Nẵng',
            products: []
        },
        {
            name: 'Đặng Thị N',
            locked: 'Bị khóa',
            role: 'Người bán',
            email: 'dangthin@example.com',
            phone: '0911 222 333',
            address: 'Hà Nội',
            shopAddress: 'Shop N, Quận Ba Đình, Hà Nội',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+12',
                    name: 'Sản phẩm N1',
                    price: '450.000đ',
                    description: 'Mô tả cho sản phẩm N1'
                },
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+13',
                    name: 'Sản phẩm N2',
                    price: '470.000đ',
                    description: 'Mô tả cho sản phẩm N2'
                }
            ]
        },
        {
            name: 'Phan Văn O',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'phanvano@example.com',
            phone: '0921 555 666',
            address: 'TP. HCM',
            products: []
        },
        {
            name: 'Tô Thị P',
            locked: 'Bình thường',
            role: 'Người dùng',
            email: 'tothip@example.com',
            phone: '0931 777 888',
            address: 'Hà Nội',
            products: []
        },
        {
            name: 'Mai Văn Q',
            locked: 'Cảnh báo',
            role: 'Người bán',
            email: 'maivanq@example.com',
            phone: '0941 888 999',
            address: 'Đà Nẵng',
            shopAddress: 'Shop Q, Quận Liên Chiểu, Đà Nẵng',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+14',
                    name: 'Sản phẩm Q1',
                    price: '380.000đ',
                    description: 'Mô tả cho sản phẩm Q1'
                }
            ]
        },
        {
            name: 'Vũ Thị R',
            locked: 'Bị khóa',
            role: 'Người bán',
            email: 'vuthir@example.com',
            phone: '0951 111 222',
            address: 'TP. HCM',
            shopAddress: 'Shop R, Quận 10, TP. HCM',
            products: [
                {
                    image: 'https://via.placeholder.com/200x300?text=Product+15',
                    name: 'Sản phẩm R1',
                    price: '410.000đ',
                    description: 'Mô tả cho sản phẩm R1'
                }
            ]
        }
    ];

    const userTableBody = document.querySelector('#userList tbody');
    const detailPanel = document.getElementById('detailPanel');
    const closeDetailBtn = document.getElementById('closeDetailBtn');

    // Các nút thay đổi trạng thái
    const btnBinhThuong = document.getElementById('btnBinhThuong');
    const btnCanhBao = document.getElementById('btnCanhBao');
    const btnKhoa = document.getElementById('btnKhoa');

    // Thẻ hiển thị thông tin chi tiết trong bảng
    const detailName = document.getElementById('detailName');
    const detailEmail = document.getElementById('detailEmail');
    const detailPhone = document.getElementById('detailPhone');
    const detailAddress = document.getElementById('detailAddress');
    const detailStatus = document.getElementById('detailStatus');
    const detailShopAddress = document.getElementById('detailShopAddress');
    const shopAddressRow = document.getElementById('shopAddressRow');
    const detailProducts = document.getElementById('detailProducts');
    const detailProductsTitle = document.getElementById('detailProductsTitle');

    let currentUser = null;
    let currentLockedCellElem = null;

    // Hàm hiển thị chi tiết
    function showDetail(user, lockedCellElem) {
        currentUser = user;
        currentLockedCellElem = lockedCellElem;

        detailName.textContent = user.name + ' (' + user.role + ')';
        detailEmail.textContent = user.email;
        detailPhone.textContent = user.phone;
        detailAddress.textContent = user.address;
        detailStatus.textContent = user.locked;

        // Nếu là shop (Người bán) và có shopAddress, hiển thị dòng "Địa chỉ shop"
        if (user.role === 'Người bán' && user.shopAddress) {
            shopAddressRow.style.display = '';
            detailShopAddress.textContent = user.shopAddress;
        } else {
            shopAddressRow.style.display = 'none';
        }

        // Nếu là shop, hiển thị danh sách sản phẩm; nếu không thì ẩn
        if (user.role === 'Người bán') {
            detailProductsTitle.style.display = 'block';
            detailProducts.style.display = 'block';
            detailProducts.innerHTML = '';
            user.products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');

                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name;
                productItem.appendChild(img);

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('product-details');

                const pName = document.createElement('p');
                pName.textContent = product.name;
                detailsDiv.appendChild(pName);

                const pPrice = document.createElement('p');
                pPrice.textContent = product.price;
                detailsDiv.appendChild(pPrice);

                const pDescription = document.createElement('p');
                pDescription.textContent = product.description;
                detailsDiv.appendChild(pDescription);

                productItem.appendChild(detailsDiv);
                detailProducts.appendChild(productItem);
            });
        } else {
            detailProductsTitle.style.display = 'none';
            detailProducts.style.display = 'none';
        }

        detailPanel.style.display = 'block';
    }

    closeDetailBtn.addEventListener('click', function () {
        detailPanel.style.display = 'none';
    });

    btnBinhThuong.addEventListener('click', function () {
        if (!currentUser) return;
        currentUser.locked = 'Bình thường';
        detailStatus.textContent = 'Bình thường';
        if (currentLockedCellElem) {
            currentLockedCellElem.textContent = 'Bình thường';
        }
    });

    btnCanhBao.addEventListener('click', function () {
        if (!currentUser) return;
        currentUser.locked = 'Cảnh báo';
        detailStatus.textContent = 'Cảnh báo';
        if (currentLockedCellElem) {
            currentLockedCellElem.textContent = 'Cảnh báo';
        }
    });

    btnKhoa.addEventListener('click', function () {
        if (!currentUser) return;
        currentUser.locked = 'Bị khóa';
        detailStatus.textContent = 'Bị khóa';
        if (currentLockedCellElem) {
            currentLockedCellElem.textContent = 'Bị khóa';
        }
    });

    // Tạo các dòng trong bảng danh sách người dùng
    users.forEach(user => {
        const row = document.createElement('tr');

        const roleCell = document.createElement('td');
        roleCell.textContent = user.role;
        row.appendChild(roleCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = user.name + ' (' + user.role + ')';
        row.appendChild(nameCell);

        const lockedCell = document.createElement('td');
        lockedCell.classList.add('locked-cell');
        lockedCell.textContent = user.locked;
        row.appendChild(lockedCell);

        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.textContent = 'Chi tiết';
        detailLink.href = '#';
        detailLink.addEventListener('click', function (e) {
            e.preventDefault();
            showDetail(user, lockedCell);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        userTableBody.appendChild(row);
    });
});
