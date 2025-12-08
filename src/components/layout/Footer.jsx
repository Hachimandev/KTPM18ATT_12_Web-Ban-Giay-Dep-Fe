import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import ShopGiayLogo from "../common/ShopGiayLogo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <ShopGiayLogo size="text-2xl" color="text-white" />
            <p className="mb-4">
              Cửa hàng giày dép thời trang hàng đầu Việt Nam
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sản Phẩm</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/nam" className="hover:text-white">
                  Giày Nam
                </Link>
              </li>
              <li>
                <Link to="/nu" className="hover:text-white">
                  Giày Nữ
                </Link>
              </li>
              <li>
                <Link to="/dep" className="hover:text-white">
                  Dép & Sandal
                </Link>
              </li>
              <li>
                <Link to="/khuyen-mai" className="hover:text-white">
                  Khuyến Mãi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/policy" className="hover:text-white">
                  Chính Sách Đổi Trả
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-white">
                  Hướng Dẫn Thanh Toán
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP HCM</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 mr-3" />
                <span>0123.456.789</span>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 mr-3" />
                <span>info@shopgiay.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ShopGiay. Tất cả quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
