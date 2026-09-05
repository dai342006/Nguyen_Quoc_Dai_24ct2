USE DigitalSkillMarketplace;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name = 'DonHang'
)
BEGIN
    CREATE TABLE DonHang (
        MaDonHang INT IDENTITY(1,1) PRIMARY KEY,

        MaKhachHang INT NOT NULL,

        MaDichVu INT NOT NULL,

        MaFreelancer INT NOT NULL,

        Gia DECIMAL(18,2) NOT NULL,

        TrangThai NVARCHAR(30) NOT NULL
            DEFAULT 'ChoXacNhan',

        NgayDat DATETIME NOT NULL
            DEFAULT GETDATE(),

        CONSTRAINT FK_DonHang_KhachHang
            FOREIGN KEY (MaKhachHang)
            REFERENCES NguoiDung(MaNguoiDung),

        CONSTRAINT FK_DonHang_DichVu
            FOREIGN KEY (MaDichVu)
            REFERENCES DichVu(MaDichVu),

        CONSTRAINT FK_DonHang_Freelancer
            FOREIGN KEY (MaFreelancer)
            REFERENCES NguoiDung(MaNguoiDung)
    );
END;
GO
SELECT * FROM DonHang;