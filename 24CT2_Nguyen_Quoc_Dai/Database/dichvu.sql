USE DigitalSkillMarketplace;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name = 'DichVu'
)
BEGIN
    CREATE TABLE DichVu (
        MaDichVu INT IDENTITY(1,1) PRIMARY KEY,
        MaNguoiDung INT NOT NULL,
        TenDichVu NVARCHAR(200) NOT NULL,
        MoTa NVARCHAR(MAX) NULL,
        DanhMuc NVARCHAR(100) NOT NULL,
        Gia DECIMAL(18,2) NOT NULL,
        TrangThai NVARCHAR(30) NOT NULL DEFAULT 'DangBan',
        NgayTao DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_DichVu_NguoiDung
        FOREIGN KEY (MaNguoiDung)
        REFERENCES NguoiDung(MaNguoiDung)
    );
END;
GO
SELECT * FROM DichVu;