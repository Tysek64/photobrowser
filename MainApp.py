import sys
import window
from PySide6.QtWidgets import QApplication, QMainWindow, QFileDialog
from PySide6.QtGui import QImage, QPixmap

class MainApp:
    def __init__(self):
        pass

    def createApp(self):
        self.app = QApplication(sys.argv)
        self.mainWindow = QMainWindow()
        self.contents = window.Ui_MainWindow()
        self.contents.setupUi(self.mainWindow)
        self.mainWindow.show()
        sys.exit(self.app.exec())

    def set_label(self, text):
        self.contents.label.setText(text)

    def set_image(self, path):
        image = QImage(path)
        pixmap = QPixmap(image)
        self.contents.label.setPixmap(pixmap.scaled(self.contents.label.width(), self.contents.label.height()))

    def get_path(self):
        dialog = QFileDialog(fileMode=QFileDialog.FileMode.Directory)
        dialog.exec()
        return dialog.selectedFiles()[0]
