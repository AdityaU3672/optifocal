import cv2, dlib, math
import numpy as np
import numpy as np

fd = open('timg.jpg', 'rb')

img_str = fd.read()

fd.close()

img = cv2.imread(img_str)

#nparr = np.fromstring(img_str, np.uint8)
#img_np = cv2.imdecode(nparr, cv2.CV_LOAD_IMAGE_COLOR)

#rgb = np.random.randint(255, size=(900,800,3),dtype=np.uint8)

cv2.imshow('RGB',img)
cv2.waitKey(0)