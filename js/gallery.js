const rawImageUrls = [
    // Engagement pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-184_r1osf2.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-339_1_un4vfv.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-250_oilisw.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-224_cx81hw.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-192_ftemat.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-190_odgcyj.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-157_hnobdr.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-172_catwkc.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-127_hids1e.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-96_znq5lf.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/Amanda_David-82_tfv5tb.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20250327_193834512.MP_Original_x4sghn",
    // Spain pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/MVIMG_20180621_201445_miz9c7.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_20180620_223607_i7xws8.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_4986_irs9tp.jpg",
    // Biking Pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/11470006_zuafhz.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/11470016_srceyj.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_4231_wi5rt6.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20241103_233155754.BURST-01.COVER_q7wfz0.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20241105_003546656.BURST-01.COVER_Original_dfglqv.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20241106_052738034.MP_Original_gcnnrx.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20241111_013823878.BURST-01.COVER_w9ixqe.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20241113_080322297.MP_Original_ar5fqm.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20250407_032005604_ntld3r.jpg",
    // Travel pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/11450033_vdheuj.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/53-DSCF6399_cng4jg.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20250418_042133368_lpy3ir.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20231120_040625098_2_kyiphb.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20230326_122309148_qmsjvz.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20230326_080314791_cgflti.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20210826_201100491.MP_mafgpf.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20210824_220414543_wault3.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20210525_184626389.MP_r5ftrz.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_20230209_143139899_HDR_vzblen.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_20190409_171812_yc5xvt.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_20190403_180417_me1ovy.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_20190325_124152_epgm5v.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_9738_i016he.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_8384_vaadvi.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_4647_qxt1pq.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_3924_2_dwsjl0.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_3482_bozmhc.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_2798_anjx5n.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_2658_agdboi.jpg",
    // Hiking pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_0780_dlnunx.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_6046_dxdl2e.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20220422_155055270_2_e9rrmz.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_9428_um8q44.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_8819_wzua9v.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_9605_uusbze.jpg",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20210523_140136112_enfwd1",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20220418_140938225_bxbbcq",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20220418_185311644_b4wnie",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20220627_160419473_vtonga",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20230809_135650976_q19dzz",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20211009_152249930_xvsetr",
    // Young couple pics
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_8766_ckrnm0",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20210828_214152237_fcywto",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/PXL_20201017_195755732.PORTRAIT-01.COVER_ilbpkv",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_6858_h6sbgw",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_5979_cd0u6r",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_3999_aqvzz0",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_3510_pok10w",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/IMG_0220_vlbohj",
    "https://res.cloudinary.com/dhv1bk5rh/image/upload/c_fit,w_1200,h_1200/f_auto/q_auto/00100sPORTRAIT_00100_BURST20180922124425012_COVER_viyp3d"
];

const imageUrls = shuffle(rawImageUrls);

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

let lastLoadedIndex = 0;
const imagesPerLoad = 15;

function loadMoreImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    const newImages = imageUrls.slice(lastLoadedIndex, lastLoadedIndex + imagesPerLoad);
    const newlyAddedGalleryItems = [];

    newImages.forEach(imageUrl => {
        const galleryItem = document.createElement('a');
        galleryItem.href = imageUrl;
        galleryItem.classList.add('gallery-item');

        const img = document.createElement('img');
        const thumbnailUrl = imageUrl.replace('c_fit,w_1200,h_1200', 'c_scale,w_400');
        img.src = thumbnailUrl;
        img.alt = 'Gallery image';

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
        newlyAddedGalleryItems.push(galleryItem);
    });

    lastLoadedIndex += imagesPerLoad;
    initGallery(newlyAddedGalleryItems);
}

function initGallery(galleryItems) {

    if (galleryItems && window.innerWidth < 768) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
        return;
    }

    if (galleryItems && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const imageUrl = item.getAttribute('href');
                const instance = basicLightbox.create(`
                    <div class="gallery-lightbox">
                        <img src="${imageUrl}">
                        <button class="close-button">&times;</button>
                    </div>
                `, {
                    onShow: (instance) => {
                        const lightbox = instance.element();
                        lightbox.querySelector('.close-button').onclick = instance.close;
                        lightbox.onclick = (event) => {
                            if (event.target.tagName !== 'IMG') {
                                instance.close();
                            }
                        };
                        document.addEventListener('keydown', (event) => {
                            if (event.key === 'Escape') {
                                instance.close();
                            }
                        });
                    },
                    onClose: (instance) => {
                        document.removeEventListener('keydown', (event) => {
                            if (event.key === 'Escape') {
                                instance.close();
                            }
                        });
                    }
                });
                instance.show();
            });
        });
    }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

document.addEventListener('DOMContentLoaded', () => {
    loadMoreImages();
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if (lastLoadedIndex < imageUrls.length) {
                loadMoreImages();
            }
        }
    });
});