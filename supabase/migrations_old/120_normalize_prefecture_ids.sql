-- ===============================
-- prefectures.id を {country_code}_{romaji} 形式に統一
-- ===============================
-- 日本: tokyo → jp_tokyo
-- 韓国: kr_11 → kr_seoul
-- タイ: th_40 → th_bangkok
-- 中国: cn_22 → cn_beijing
-- 台湾: 既にローマ字形式（変更なし）
-- ===============================

-- ===============================
-- 1. 外部キー制約を一時的に削除
-- ===============================
ALTER TABLE cities DROP CONSTRAINT IF EXISTS cities_prefecture_id_fkey;
ALTER TABLE machi DROP CONSTRAINT IF EXISTS machi_prefecture_id_fkey;
ALTER TABLE transport_hubs DROP CONSTRAINT IF EXISTS transport_hubs_prefecture_id_fkey;

-- ===============================
-- 2. 日本のprefectures.idにjp_プレフィックスを追加
-- ===============================
-- cities
UPDATE cities SET prefecture_id = 'jp_' || prefecture_id WHERE prefecture_id NOT LIKE '%_%';
-- machi
UPDATE machi SET prefecture_id = 'jp_' || prefecture_id WHERE prefecture_id NOT LIKE '%_%';
-- transport_hubs
UPDATE transport_hubs SET prefecture_id = 'jp_' || prefecture_id WHERE prefecture_id IS NOT NULL AND prefecture_id NOT LIKE '%_%';
-- prefectures
UPDATE prefectures SET id = 'jp_' || id WHERE id NOT LIKE '%_%';

-- ===============================
-- 3. 韓国のprefectures.idをローマ字に変換
-- ===============================
-- kr_01 → kr_jeju
UPDATE cities SET prefecture_id = 'kr_jeju' WHERE prefecture_id = 'kr_01';
UPDATE machi SET prefecture_id = 'kr_jeju' WHERE prefecture_id = 'kr_01';
UPDATE prefectures SET id = 'kr_jeju' WHERE id = 'kr_01';

-- kr_03 → kr_jeonbuk
UPDATE cities SET prefecture_id = 'kr_jeonbuk' WHERE prefecture_id = 'kr_03';
UPDATE machi SET prefecture_id = 'kr_jeonbuk' WHERE prefecture_id = 'kr_03';
UPDATE prefectures SET id = 'kr_jeonbuk' WHERE id = 'kr_03';

-- kr_05 → kr_chungcheongbuk
UPDATE cities SET prefecture_id = 'kr_chungcheongbuk' WHERE prefecture_id = 'kr_05';
UPDATE machi SET prefecture_id = 'kr_chungcheongbuk' WHERE prefecture_id = 'kr_05';
UPDATE prefectures SET id = 'kr_chungcheongbuk' WHERE id = 'kr_05';

-- kr_06 → kr_gangwon
UPDATE cities SET prefecture_id = 'kr_gangwon' WHERE prefecture_id = 'kr_06';
UPDATE machi SET prefecture_id = 'kr_gangwon' WHERE prefecture_id = 'kr_06';
UPDATE prefectures SET id = 'kr_gangwon' WHERE id = 'kr_06';

-- kr_10 → kr_busan
UPDATE cities SET prefecture_id = 'kr_busan' WHERE prefecture_id = 'kr_10';
UPDATE machi SET prefecture_id = 'kr_busan' WHERE prefecture_id = 'kr_10';
UPDATE prefectures SET id = 'kr_busan' WHERE id = 'kr_10';

-- kr_11 → kr_seoul
UPDATE cities SET prefecture_id = 'kr_seoul' WHERE prefecture_id = 'kr_11';
UPDATE machi SET prefecture_id = 'kr_seoul' WHERE prefecture_id = 'kr_11';
UPDATE prefectures SET id = 'kr_seoul' WHERE id = 'kr_11';

-- kr_12 → kr_incheon
UPDATE cities SET prefecture_id = 'kr_incheon' WHERE prefecture_id = 'kr_12';
UPDATE machi SET prefecture_id = 'kr_incheon' WHERE prefecture_id = 'kr_12';
UPDATE prefectures SET id = 'kr_incheon' WHERE id = 'kr_12';

-- kr_13 → kr_gyeonggi
UPDATE cities SET prefecture_id = 'kr_gyeonggi' WHERE prefecture_id = 'kr_13';
UPDATE machi SET prefecture_id = 'kr_gyeonggi' WHERE prefecture_id = 'kr_13';
UPDATE prefectures SET id = 'kr_gyeonggi' WHERE id = 'kr_13';

-- kr_14 → kr_gyeongsangbuk
UPDATE cities SET prefecture_id = 'kr_gyeongsangbuk' WHERE prefecture_id = 'kr_14';
UPDATE machi SET prefecture_id = 'kr_gyeongsangbuk' WHERE prefecture_id = 'kr_14';
UPDATE prefectures SET id = 'kr_gyeongsangbuk' WHERE id = 'kr_14';

-- kr_15 → kr_daegu
UPDATE cities SET prefecture_id = 'kr_daegu' WHERE prefecture_id = 'kr_15';
UPDATE machi SET prefecture_id = 'kr_daegu' WHERE prefecture_id = 'kr_15';
UPDATE prefectures SET id = 'kr_daegu' WHERE id = 'kr_15';

-- kr_16 → kr_jeollanam
UPDATE cities SET prefecture_id = 'kr_jeollanam' WHERE prefecture_id = 'kr_16';
UPDATE machi SET prefecture_id = 'kr_jeollanam' WHERE prefecture_id = 'kr_16';
UPDATE prefectures SET id = 'kr_jeollanam' WHERE id = 'kr_16';

-- kr_17 → kr_chungcheongnam
UPDATE cities SET prefecture_id = 'kr_chungcheongnam' WHERE prefecture_id = 'kr_17';
UPDATE machi SET prefecture_id = 'kr_chungcheongnam' WHERE prefecture_id = 'kr_17';
UPDATE prefectures SET id = 'kr_chungcheongnam' WHERE id = 'kr_17';

-- kr_18 → kr_gwangju
UPDATE cities SET prefecture_id = 'kr_gwangju' WHERE prefecture_id = 'kr_18';
UPDATE machi SET prefecture_id = 'kr_gwangju' WHERE prefecture_id = 'kr_18';
UPDATE prefectures SET id = 'kr_gwangju' WHERE id = 'kr_18';

-- kr_19 → kr_daejeon
UPDATE cities SET prefecture_id = 'kr_daejeon' WHERE prefecture_id = 'kr_19';
UPDATE machi SET prefecture_id = 'kr_daejeon' WHERE prefecture_id = 'kr_19';
UPDATE prefectures SET id = 'kr_daejeon' WHERE id = 'kr_19';

-- kr_20 → kr_gyeongsangnam
UPDATE cities SET prefecture_id = 'kr_gyeongsangnam' WHERE prefecture_id = 'kr_20';
UPDATE machi SET prefecture_id = 'kr_gyeongsangnam' WHERE prefecture_id = 'kr_20';
UPDATE prefectures SET id = 'kr_gyeongsangnam' WHERE id = 'kr_20';

-- kr_21 → kr_ulsan
UPDATE cities SET prefecture_id = 'kr_ulsan' WHERE prefecture_id = 'kr_21';
UPDATE machi SET prefecture_id = 'kr_ulsan' WHERE prefecture_id = 'kr_21';
UPDATE prefectures SET id = 'kr_ulsan' WHERE id = 'kr_21';

-- kr_22 → kr_sejong
UPDATE cities SET prefecture_id = 'kr_sejong' WHERE prefecture_id = 'kr_22';
UPDATE machi SET prefecture_id = 'kr_sejong' WHERE prefecture_id = 'kr_22';
UPDATE prefectures SET id = 'kr_sejong' WHERE id = 'kr_22';

-- ===============================
-- 4. 中国のprefectures.idをローマ字に変換
-- ===============================
-- cn_01 → cn_anhui
UPDATE cities SET prefecture_id = 'cn_anhui' WHERE prefecture_id = 'cn_01';
UPDATE machi SET prefecture_id = 'cn_anhui' WHERE prefecture_id = 'cn_01';
UPDATE prefectures SET id = 'cn_anhui' WHERE id = 'cn_01';

-- cn_02 → cn_zhejiang
UPDATE cities SET prefecture_id = 'cn_zhejiang' WHERE prefecture_id = 'cn_02';
UPDATE machi SET prefecture_id = 'cn_zhejiang' WHERE prefecture_id = 'cn_02';
UPDATE prefectures SET id = 'cn_zhejiang' WHERE id = 'cn_02';

-- cn_03 → cn_jiangxi
UPDATE cities SET prefecture_id = 'cn_jiangxi' WHERE prefecture_id = 'cn_03';
UPDATE machi SET prefecture_id = 'cn_jiangxi' WHERE prefecture_id = 'cn_03';
UPDATE prefectures SET id = 'cn_jiangxi' WHERE id = 'cn_03';

-- cn_04 → cn_jiangsu
UPDATE cities SET prefecture_id = 'cn_jiangsu' WHERE prefecture_id = 'cn_04';
UPDATE machi SET prefecture_id = 'cn_jiangsu' WHERE prefecture_id = 'cn_04';
UPDATE prefectures SET id = 'cn_jiangsu' WHERE id = 'cn_04';

-- cn_05 → cn_jilin
UPDATE cities SET prefecture_id = 'cn_jilin' WHERE prefecture_id = 'cn_05';
UPDATE machi SET prefecture_id = 'cn_jilin' WHERE prefecture_id = 'cn_05';
UPDATE prefectures SET id = 'cn_jilin' WHERE id = 'cn_05';

-- cn_06 → cn_qinghai
UPDATE cities SET prefecture_id = 'cn_qinghai' WHERE prefecture_id = 'cn_06';
UPDATE machi SET prefecture_id = 'cn_qinghai' WHERE prefecture_id = 'cn_06';
UPDATE prefectures SET id = 'cn_qinghai' WHERE id = 'cn_06';

-- cn_07 → cn_fujian
UPDATE cities SET prefecture_id = 'cn_fujian' WHERE prefecture_id = 'cn_07';
UPDATE machi SET prefecture_id = 'cn_fujian' WHERE prefecture_id = 'cn_07';
UPDATE prefectures SET id = 'cn_fujian' WHERE id = 'cn_07';

-- cn_08 → cn_heilongjiang
UPDATE cities SET prefecture_id = 'cn_heilongjiang' WHERE prefecture_id = 'cn_08';
UPDATE machi SET prefecture_id = 'cn_heilongjiang' WHERE prefecture_id = 'cn_08';
UPDATE prefectures SET id = 'cn_heilongjiang' WHERE id = 'cn_08';

-- cn_09 → cn_henan
UPDATE cities SET prefecture_id = 'cn_henan' WHERE prefecture_id = 'cn_09';
UPDATE machi SET prefecture_id = 'cn_henan' WHERE prefecture_id = 'cn_09';
UPDATE prefectures SET id = 'cn_henan' WHERE id = 'cn_09';

-- cn_10 → cn_hebei
UPDATE cities SET prefecture_id = 'cn_hebei' WHERE prefecture_id = 'cn_10';
UPDATE machi SET prefecture_id = 'cn_hebei' WHERE prefecture_id = 'cn_10';
UPDATE prefectures SET id = 'cn_hebei' WHERE id = 'cn_10';

-- cn_11 → cn_hunan
UPDATE cities SET prefecture_id = 'cn_hunan' WHERE prefecture_id = 'cn_11';
UPDATE machi SET prefecture_id = 'cn_hunan' WHERE prefecture_id = 'cn_11';
UPDATE prefectures SET id = 'cn_hunan' WHERE id = 'cn_11';

-- cn_12 → cn_hubei
UPDATE cities SET prefecture_id = 'cn_hubei' WHERE prefecture_id = 'cn_12';
UPDATE machi SET prefecture_id = 'cn_hubei' WHERE prefecture_id = 'cn_12';
UPDATE prefectures SET id = 'cn_hubei' WHERE id = 'cn_12';

-- cn_13 → cn_xinjiang
UPDATE cities SET prefecture_id = 'cn_xinjiang' WHERE prefecture_id = 'cn_13';
UPDATE machi SET prefecture_id = 'cn_xinjiang' WHERE prefecture_id = 'cn_13';
UPDATE prefectures SET id = 'cn_xinjiang' WHERE id = 'cn_13';

-- cn_14 → cn_tibet
UPDATE cities SET prefecture_id = 'cn_tibet' WHERE prefecture_id = 'cn_14';
UPDATE machi SET prefecture_id = 'cn_tibet' WHERE prefecture_id = 'cn_14';
UPDATE prefectures SET id = 'cn_tibet' WHERE id = 'cn_14';

-- cn_15 → cn_gansu
UPDATE cities SET prefecture_id = 'cn_gansu' WHERE prefecture_id = 'cn_15';
UPDATE machi SET prefecture_id = 'cn_gansu' WHERE prefecture_id = 'cn_15';
UPDATE prefectures SET id = 'cn_gansu' WHERE id = 'cn_15';

-- cn_16 → cn_guangxi
UPDATE cities SET prefecture_id = 'cn_guangxi' WHERE prefecture_id = 'cn_16';
UPDATE machi SET prefecture_id = 'cn_guangxi' WHERE prefecture_id = 'cn_16';
UPDATE prefectures SET id = 'cn_guangxi' WHERE id = 'cn_16';

-- cn_18 → cn_guizhou
UPDATE cities SET prefecture_id = 'cn_guizhou' WHERE prefecture_id = 'cn_18';
UPDATE machi SET prefecture_id = 'cn_guizhou' WHERE prefecture_id = 'cn_18';
UPDATE prefectures SET id = 'cn_guizhou' WHERE id = 'cn_18';

-- cn_19 → cn_liaoning
UPDATE cities SET prefecture_id = 'cn_liaoning' WHERE prefecture_id = 'cn_19';
UPDATE machi SET prefecture_id = 'cn_liaoning' WHERE prefecture_id = 'cn_19';
UPDATE prefectures SET id = 'cn_liaoning' WHERE id = 'cn_19';

-- cn_20 → cn_inner_mongolia
UPDATE cities SET prefecture_id = 'cn_inner_mongolia' WHERE prefecture_id = 'cn_20';
UPDATE machi SET prefecture_id = 'cn_inner_mongolia' WHERE prefecture_id = 'cn_20';
UPDATE prefectures SET id = 'cn_inner_mongolia' WHERE id = 'cn_20';

-- cn_21 → cn_ningxia
UPDATE cities SET prefecture_id = 'cn_ningxia' WHERE prefecture_id = 'cn_21';
UPDATE machi SET prefecture_id = 'cn_ningxia' WHERE prefecture_id = 'cn_21';
UPDATE prefectures SET id = 'cn_ningxia' WHERE id = 'cn_21';

-- cn_22 → cn_beijing
UPDATE cities SET prefecture_id = 'cn_beijing' WHERE prefecture_id = 'cn_22';
UPDATE machi SET prefecture_id = 'cn_beijing' WHERE prefecture_id = 'cn_22';
UPDATE prefectures SET id = 'cn_beijing' WHERE id = 'cn_22';

-- cn_23 → cn_shanghai
UPDATE cities SET prefecture_id = 'cn_shanghai' WHERE prefecture_id = 'cn_23';
UPDATE machi SET prefecture_id = 'cn_shanghai' WHERE prefecture_id = 'cn_23';
UPDATE prefectures SET id = 'cn_shanghai' WHERE id = 'cn_23';

-- cn_24 → cn_shanxi
UPDATE cities SET prefecture_id = 'cn_shanxi' WHERE prefecture_id = 'cn_24';
UPDATE machi SET prefecture_id = 'cn_shanxi' WHERE prefecture_id = 'cn_24';
UPDATE prefectures SET id = 'cn_shanxi' WHERE id = 'cn_24';

-- cn_25 → cn_shandong
UPDATE cities SET prefecture_id = 'cn_shandong' WHERE prefecture_id = 'cn_25';
UPDATE machi SET prefecture_id = 'cn_shandong' WHERE prefecture_id = 'cn_25';
UPDATE prefectures SET id = 'cn_shandong' WHERE id = 'cn_25';

-- cn_26 → cn_shaanxi
UPDATE cities SET prefecture_id = 'cn_shaanxi' WHERE prefecture_id = 'cn_26';
UPDATE machi SET prefecture_id = 'cn_shaanxi' WHERE prefecture_id = 'cn_26';
UPDATE prefectures SET id = 'cn_shaanxi' WHERE id = 'cn_26';

-- cn_28 → cn_tianjin
UPDATE cities SET prefecture_id = 'cn_tianjin' WHERE prefecture_id = 'cn_28';
UPDATE machi SET prefecture_id = 'cn_tianjin' WHERE prefecture_id = 'cn_28';
UPDATE prefectures SET id = 'cn_tianjin' WHERE id = 'cn_28';

-- cn_29 → cn_yunnan
UPDATE cities SET prefecture_id = 'cn_yunnan' WHERE prefecture_id = 'cn_29';
UPDATE machi SET prefecture_id = 'cn_yunnan' WHERE prefecture_id = 'cn_29';
UPDATE prefectures SET id = 'cn_yunnan' WHERE id = 'cn_29';

-- cn_30 → cn_guangdong
UPDATE cities SET prefecture_id = 'cn_guangdong' WHERE prefecture_id = 'cn_30';
UPDATE machi SET prefecture_id = 'cn_guangdong' WHERE prefecture_id = 'cn_30';
UPDATE prefectures SET id = 'cn_guangdong' WHERE id = 'cn_30';

-- cn_31 → cn_hainan
UPDATE cities SET prefecture_id = 'cn_hainan' WHERE prefecture_id = 'cn_31';
UPDATE machi SET prefecture_id = 'cn_hainan' WHERE prefecture_id = 'cn_31';
UPDATE prefectures SET id = 'cn_hainan' WHERE id = 'cn_31';

-- cn_32 → cn_sichuan
UPDATE cities SET prefecture_id = 'cn_sichuan' WHERE prefecture_id = 'cn_32';
UPDATE machi SET prefecture_id = 'cn_sichuan' WHERE prefecture_id = 'cn_32';
UPDATE prefectures SET id = 'cn_sichuan' WHERE id = 'cn_32';

-- cn_33 → cn_chongqing
UPDATE cities SET prefecture_id = 'cn_chongqing' WHERE prefecture_id = 'cn_33';
UPDATE machi SET prefecture_id = 'cn_chongqing' WHERE prefecture_id = 'cn_33';
UPDATE prefectures SET id = 'cn_chongqing' WHERE id = 'cn_33';

-- ===============================
-- 5. タイのprefectures.idをローマ字に変換
-- ===============================
-- th_01 → th_mae_hong_son
UPDATE cities SET prefecture_id = 'th_mae_hong_son' WHERE prefecture_id = 'th_01';
UPDATE machi SET prefecture_id = 'th_mae_hong_son' WHERE prefecture_id = 'th_01';
UPDATE prefectures SET id = 'th_mae_hong_son' WHERE id = 'th_01';

-- th_02 → th_chiang_mai
UPDATE cities SET prefecture_id = 'th_chiang_mai' WHERE prefecture_id = 'th_02';
UPDATE machi SET prefecture_id = 'th_chiang_mai' WHERE prefecture_id = 'th_02';
UPDATE prefectures SET id = 'th_chiang_mai' WHERE id = 'th_02';

-- th_03 → th_chiang_rai
UPDATE cities SET prefecture_id = 'th_chiang_rai' WHERE prefecture_id = 'th_03';
UPDATE machi SET prefecture_id = 'th_chiang_rai' WHERE prefecture_id = 'th_03';
UPDATE prefectures SET id = 'th_chiang_rai' WHERE id = 'th_03';

-- th_04 → th_nan
UPDATE cities SET prefecture_id = 'th_nan' WHERE prefecture_id = 'th_04';
UPDATE machi SET prefecture_id = 'th_nan' WHERE prefecture_id = 'th_04';
UPDATE prefectures SET id = 'th_nan' WHERE id = 'th_04';

-- th_05 → th_lamphun
UPDATE cities SET prefecture_id = 'th_lamphun' WHERE prefecture_id = 'th_05';
UPDATE machi SET prefecture_id = 'th_lamphun' WHERE prefecture_id = 'th_05';
UPDATE prefectures SET id = 'th_lamphun' WHERE id = 'th_05';

-- th_06 → th_lampang
UPDATE cities SET prefecture_id = 'th_lampang' WHERE prefecture_id = 'th_06';
UPDATE machi SET prefecture_id = 'th_lampang' WHERE prefecture_id = 'th_06';
UPDATE prefectures SET id = 'th_lampang' WHERE id = 'th_06';

-- th_07 → th_phrae
UPDATE cities SET prefecture_id = 'th_phrae' WHERE prefecture_id = 'th_07';
UPDATE machi SET prefecture_id = 'th_phrae' WHERE prefecture_id = 'th_07';
UPDATE prefectures SET id = 'th_phrae' WHERE id = 'th_07';

-- th_08 → th_tak
UPDATE cities SET prefecture_id = 'th_tak' WHERE prefecture_id = 'th_08';
UPDATE machi SET prefecture_id = 'th_tak' WHERE prefecture_id = 'th_08';
UPDATE prefectures SET id = 'th_tak' WHERE id = 'th_08';

-- th_09 → th_sukhothai
UPDATE cities SET prefecture_id = 'th_sukhothai' WHERE prefecture_id = 'th_09';
UPDATE machi SET prefecture_id = 'th_sukhothai' WHERE prefecture_id = 'th_09';
UPDATE prefectures SET id = 'th_sukhothai' WHERE id = 'th_09';

-- th_10 → th_uttaradit
UPDATE cities SET prefecture_id = 'th_uttaradit' WHERE prefecture_id = 'th_10';
UPDATE machi SET prefecture_id = 'th_uttaradit' WHERE prefecture_id = 'th_10';
UPDATE prefectures SET id = 'th_uttaradit' WHERE id = 'th_10';

-- th_11 → th_kamphaeng_phet
UPDATE cities SET prefecture_id = 'th_kamphaeng_phet' WHERE prefecture_id = 'th_11';
UPDATE machi SET prefecture_id = 'th_kamphaeng_phet' WHERE prefecture_id = 'th_11';
UPDATE prefectures SET id = 'th_kamphaeng_phet' WHERE id = 'th_11';

-- th_12 → th_phitsanulok
UPDATE cities SET prefecture_id = 'th_phitsanulok' WHERE prefecture_id = 'th_12';
UPDATE machi SET prefecture_id = 'th_phitsanulok' WHERE prefecture_id = 'th_12';
UPDATE prefectures SET id = 'th_phitsanulok' WHERE id = 'th_12';

-- th_13 → th_phichit
UPDATE cities SET prefecture_id = 'th_phichit' WHERE prefecture_id = 'th_13';
UPDATE machi SET prefecture_id = 'th_phichit' WHERE prefecture_id = 'th_13';
UPDATE prefectures SET id = 'th_phichit' WHERE id = 'th_13';

-- th_14 → th_phetchabun
UPDATE cities SET prefecture_id = 'th_phetchabun' WHERE prefecture_id = 'th_14';
UPDATE machi SET prefecture_id = 'th_phetchabun' WHERE prefecture_id = 'th_14';
UPDATE prefectures SET id = 'th_phetchabun' WHERE id = 'th_14';

-- th_15 → th_uthai_thani
UPDATE cities SET prefecture_id = 'th_uthai_thani' WHERE prefecture_id = 'th_15';
UPDATE machi SET prefecture_id = 'th_uthai_thani' WHERE prefecture_id = 'th_15';
UPDATE prefectures SET id = 'th_uthai_thani' WHERE id = 'th_15';

-- th_16 → th_nakhon_sawan
UPDATE cities SET prefecture_id = 'th_nakhon_sawan' WHERE prefecture_id = 'th_16';
UPDATE machi SET prefecture_id = 'th_nakhon_sawan' WHERE prefecture_id = 'th_16';
UPDATE prefectures SET id = 'th_nakhon_sawan' WHERE id = 'th_16';

-- th_17 → th_nong_khai
UPDATE cities SET prefecture_id = 'th_nong_khai' WHERE prefecture_id = 'th_17';
UPDATE machi SET prefecture_id = 'th_nong_khai' WHERE prefecture_id = 'th_17';
UPDATE prefectures SET id = 'th_nong_khai' WHERE id = 'th_17';

-- th_18 → th_loei
UPDATE cities SET prefecture_id = 'th_loei' WHERE prefecture_id = 'th_18';
UPDATE machi SET prefecture_id = 'th_loei' WHERE prefecture_id = 'th_18';
UPDATE prefectures SET id = 'th_loei' WHERE id = 'th_18';

-- th_20 → th_sakon_nakhon
UPDATE cities SET prefecture_id = 'th_sakon_nakhon' WHERE prefecture_id = 'th_20';
UPDATE machi SET prefecture_id = 'th_sakon_nakhon' WHERE prefecture_id = 'th_20';
UPDATE prefectures SET id = 'th_sakon_nakhon' WHERE id = 'th_20';

-- th_22 → th_khon_kaen
UPDATE cities SET prefecture_id = 'th_khon_kaen' WHERE prefecture_id = 'th_22';
UPDATE machi SET prefecture_id = 'th_khon_kaen' WHERE prefecture_id = 'th_22';
UPDATE prefectures SET id = 'th_khon_kaen' WHERE id = 'th_22';

-- th_23 → th_kalasin
UPDATE cities SET prefecture_id = 'th_kalasin' WHERE prefecture_id = 'th_23';
UPDATE machi SET prefecture_id = 'th_kalasin' WHERE prefecture_id = 'th_23';
UPDATE prefectures SET id = 'th_kalasin' WHERE id = 'th_23';

-- th_24 → th_maha_sarakham
UPDATE cities SET prefecture_id = 'th_maha_sarakham' WHERE prefecture_id = 'th_24';
UPDATE machi SET prefecture_id = 'th_maha_sarakham' WHERE prefecture_id = 'th_24';
UPDATE prefectures SET id = 'th_maha_sarakham' WHERE id = 'th_24';

-- th_25 → th_roi_et
UPDATE cities SET prefecture_id = 'th_roi_et' WHERE prefecture_id = 'th_25';
UPDATE machi SET prefecture_id = 'th_roi_et' WHERE prefecture_id = 'th_25';
UPDATE prefectures SET id = 'th_roi_et' WHERE id = 'th_25';

-- th_26 → th_chaiyaphum
UPDATE cities SET prefecture_id = 'th_chaiyaphum' WHERE prefecture_id = 'th_26';
UPDATE machi SET prefecture_id = 'th_chaiyaphum' WHERE prefecture_id = 'th_26';
UPDATE prefectures SET id = 'th_chaiyaphum' WHERE id = 'th_26';

-- th_27 → th_nakhon_ratchasima
UPDATE cities SET prefecture_id = 'th_nakhon_ratchasima' WHERE prefecture_id = 'th_27';
UPDATE machi SET prefecture_id = 'th_nakhon_ratchasima' WHERE prefecture_id = 'th_27';
UPDATE prefectures SET id = 'th_nakhon_ratchasima' WHERE id = 'th_27';

-- th_28 → th_buri_ram
UPDATE cities SET prefecture_id = 'th_buri_ram' WHERE prefecture_id = 'th_28';
UPDATE machi SET prefecture_id = 'th_buri_ram' WHERE prefecture_id = 'th_28';
UPDATE prefectures SET id = 'th_buri_ram' WHERE id = 'th_28';

-- th_29 → th_surin
UPDATE cities SET prefecture_id = 'th_surin' WHERE prefecture_id = 'th_29';
UPDATE machi SET prefecture_id = 'th_surin' WHERE prefecture_id = 'th_29';
UPDATE prefectures SET id = 'th_surin' WHERE id = 'th_29';

-- th_30 → th_si_sa_ket
UPDATE cities SET prefecture_id = 'th_si_sa_ket' WHERE prefecture_id = 'th_30';
UPDATE machi SET prefecture_id = 'th_si_sa_ket' WHERE prefecture_id = 'th_30';
UPDATE prefectures SET id = 'th_si_sa_ket' WHERE id = 'th_30';

-- th_31 → th_narathiwat
UPDATE cities SET prefecture_id = 'th_narathiwat' WHERE prefecture_id = 'th_31';
UPDATE machi SET prefecture_id = 'th_narathiwat' WHERE prefecture_id = 'th_31';
UPDATE prefectures SET id = 'th_narathiwat' WHERE id = 'th_31';

-- th_32 → th_chai_nat
UPDATE cities SET prefecture_id = 'th_chai_nat' WHERE prefecture_id = 'th_32';
UPDATE machi SET prefecture_id = 'th_chai_nat' WHERE prefecture_id = 'th_32';
UPDATE prefectures SET id = 'th_chai_nat' WHERE id = 'th_32';

-- th_33 → th_sing_buri
UPDATE cities SET prefecture_id = 'th_sing_buri' WHERE prefecture_id = 'th_33';
UPDATE machi SET prefecture_id = 'th_sing_buri' WHERE prefecture_id = 'th_33';
UPDATE prefectures SET id = 'th_sing_buri' WHERE id = 'th_33';

-- th_34 → th_lop_buri
UPDATE cities SET prefecture_id = 'th_lop_buri' WHERE prefecture_id = 'th_34';
UPDATE machi SET prefecture_id = 'th_lop_buri' WHERE prefecture_id = 'th_34';
UPDATE prefectures SET id = 'th_lop_buri' WHERE id = 'th_34';

-- th_35 → th_ang_thong
UPDATE cities SET prefecture_id = 'th_ang_thong' WHERE prefecture_id = 'th_35';
UPDATE machi SET prefecture_id = 'th_ang_thong' WHERE prefecture_id = 'th_35';
UPDATE prefectures SET id = 'th_ang_thong' WHERE id = 'th_35';

-- th_36 → th_phra_nakhon_si_ayutthaya
UPDATE cities SET prefecture_id = 'th_phra_nakhon_si_ayutthaya' WHERE prefecture_id = 'th_36';
UPDATE machi SET prefecture_id = 'th_phra_nakhon_si_ayutthaya' WHERE prefecture_id = 'th_36';
UPDATE prefectures SET id = 'th_phra_nakhon_si_ayutthaya' WHERE id = 'th_36';

-- th_37 → th_saraburi
UPDATE cities SET prefecture_id = 'th_saraburi' WHERE prefecture_id = 'th_37';
UPDATE machi SET prefecture_id = 'th_saraburi' WHERE prefecture_id = 'th_37';
UPDATE prefectures SET id = 'th_saraburi' WHERE id = 'th_37';

-- th_38 → th_nonthaburi
UPDATE cities SET prefecture_id = 'th_nonthaburi' WHERE prefecture_id = 'th_38';
UPDATE machi SET prefecture_id = 'th_nonthaburi' WHERE prefecture_id = 'th_38';
UPDATE prefectures SET id = 'th_nonthaburi' WHERE id = 'th_38';

-- th_39 → th_pathum_thani
UPDATE cities SET prefecture_id = 'th_pathum_thani' WHERE prefecture_id = 'th_39';
UPDATE machi SET prefecture_id = 'th_pathum_thani' WHERE prefecture_id = 'th_39';
UPDATE prefectures SET id = 'th_pathum_thani' WHERE id = 'th_39';

-- th_40 → th_bangkok
UPDATE cities SET prefecture_id = 'th_bangkok' WHERE prefecture_id = 'th_40';
UPDATE machi SET prefecture_id = 'th_bangkok' WHERE prefecture_id = 'th_40';
UPDATE prefectures SET id = 'th_bangkok' WHERE id = 'th_40';

-- th_41 → th_phayao
UPDATE cities SET prefecture_id = 'th_phayao' WHERE prefecture_id = 'th_41';
UPDATE machi SET prefecture_id = 'th_phayao' WHERE prefecture_id = 'th_41';
UPDATE prefectures SET id = 'th_phayao' WHERE id = 'th_41';

-- th_42 → th_samut_prakan
UPDATE cities SET prefecture_id = 'th_samut_prakan' WHERE prefecture_id = 'th_42';
UPDATE machi SET prefecture_id = 'th_samut_prakan' WHERE prefecture_id = 'th_42';
UPDATE prefectures SET id = 'th_samut_prakan' WHERE id = 'th_42';

-- th_43 → th_nakhon_nayok
UPDATE cities SET prefecture_id = 'th_nakhon_nayok' WHERE prefecture_id = 'th_43';
UPDATE machi SET prefecture_id = 'th_nakhon_nayok' WHERE prefecture_id = 'th_43';
UPDATE prefectures SET id = 'th_nakhon_nayok' WHERE id = 'th_43';

-- th_44 → th_chachoengsao
UPDATE cities SET prefecture_id = 'th_chachoengsao' WHERE prefecture_id = 'th_44';
UPDATE machi SET prefecture_id = 'th_chachoengsao' WHERE prefecture_id = 'th_44';
UPDATE prefectures SET id = 'th_chachoengsao' WHERE id = 'th_44';

-- th_46 → th_chon_buri
UPDATE cities SET prefecture_id = 'th_chon_buri' WHERE prefecture_id = 'th_46';
UPDATE machi SET prefecture_id = 'th_chon_buri' WHERE prefecture_id = 'th_46';
UPDATE prefectures SET id = 'th_chon_buri' WHERE id = 'th_46';

-- th_47 → th_rayong
UPDATE cities SET prefecture_id = 'th_rayong' WHERE prefecture_id = 'th_47';
UPDATE machi SET prefecture_id = 'th_rayong' WHERE prefecture_id = 'th_47';
UPDATE prefectures SET id = 'th_rayong' WHERE id = 'th_47';

-- th_48 → th_chanthaburi
UPDATE cities SET prefecture_id = 'th_chanthaburi' WHERE prefecture_id = 'th_48';
UPDATE machi SET prefecture_id = 'th_chanthaburi' WHERE prefecture_id = 'th_48';
UPDATE prefectures SET id = 'th_chanthaburi' WHERE id = 'th_48';

-- th_49 → th_trat
UPDATE cities SET prefecture_id = 'th_trat' WHERE prefecture_id = 'th_49';
UPDATE machi SET prefecture_id = 'th_trat' WHERE prefecture_id = 'th_49';
UPDATE prefectures SET id = 'th_trat' WHERE id = 'th_49';

-- th_50 → th_kanchanaburi
UPDATE cities SET prefecture_id = 'th_kanchanaburi' WHERE prefecture_id = 'th_50';
UPDATE machi SET prefecture_id = 'th_kanchanaburi' WHERE prefecture_id = 'th_50';
UPDATE prefectures SET id = 'th_kanchanaburi' WHERE id = 'th_50';

-- th_51 → th_suphan_buri
UPDATE cities SET prefecture_id = 'th_suphan_buri' WHERE prefecture_id = 'th_51';
UPDATE machi SET prefecture_id = 'th_suphan_buri' WHERE prefecture_id = 'th_51';
UPDATE prefectures SET id = 'th_suphan_buri' WHERE id = 'th_51';

-- th_52 → th_ratchaburi
UPDATE cities SET prefecture_id = 'th_ratchaburi' WHERE prefecture_id = 'th_52';
UPDATE machi SET prefecture_id = 'th_ratchaburi' WHERE prefecture_id = 'th_52';
UPDATE prefectures SET id = 'th_ratchaburi' WHERE id = 'th_52';

-- th_53 → th_nakhon_pathom
UPDATE cities SET prefecture_id = 'th_nakhon_pathom' WHERE prefecture_id = 'th_53';
UPDATE machi SET prefecture_id = 'th_nakhon_pathom' WHERE prefecture_id = 'th_53';
UPDATE prefectures SET id = 'th_nakhon_pathom' WHERE id = 'th_53';

-- th_54 → th_samut_songkhram
UPDATE cities SET prefecture_id = 'th_samut_songkhram' WHERE prefecture_id = 'th_54';
UPDATE machi SET prefecture_id = 'th_samut_songkhram' WHERE prefecture_id = 'th_54';
UPDATE prefectures SET id = 'th_samut_songkhram' WHERE id = 'th_54';

-- th_55 → th_samut_sakhon
UPDATE cities SET prefecture_id = 'th_samut_sakhon' WHERE prefecture_id = 'th_55';
UPDATE machi SET prefecture_id = 'th_samut_sakhon' WHERE prefecture_id = 'th_55';
UPDATE prefectures SET id = 'th_samut_sakhon' WHERE id = 'th_55';

-- th_56 → th_phetchaburi
UPDATE cities SET prefecture_id = 'th_phetchaburi' WHERE prefecture_id = 'th_56';
UPDATE machi SET prefecture_id = 'th_phetchaburi' WHERE prefecture_id = 'th_56';
UPDATE prefectures SET id = 'th_phetchaburi' WHERE id = 'th_56';

-- th_57 → th_prachuap_khiri_khan
UPDATE cities SET prefecture_id = 'th_prachuap_khiri_khan' WHERE prefecture_id = 'th_57';
UPDATE machi SET prefecture_id = 'th_prachuap_khiri_khan' WHERE prefecture_id = 'th_57';
UPDATE prefectures SET id = 'th_prachuap_khiri_khan' WHERE id = 'th_57';

-- th_58 → th_chumphon
UPDATE cities SET prefecture_id = 'th_chumphon' WHERE prefecture_id = 'th_58';
UPDATE machi SET prefecture_id = 'th_chumphon' WHERE prefecture_id = 'th_58';
UPDATE prefectures SET id = 'th_chumphon' WHERE id = 'th_58';

-- th_59 → th_ranong
UPDATE cities SET prefecture_id = 'th_ranong' WHERE prefecture_id = 'th_59';
UPDATE machi SET prefecture_id = 'th_ranong' WHERE prefecture_id = 'th_59';
UPDATE prefectures SET id = 'th_ranong' WHERE id = 'th_59';

-- th_60 → th_surat_thani
UPDATE cities SET prefecture_id = 'th_surat_thani' WHERE prefecture_id = 'th_60';
UPDATE machi SET prefecture_id = 'th_surat_thani' WHERE prefecture_id = 'th_60';
UPDATE prefectures SET id = 'th_surat_thani' WHERE id = 'th_60';

-- th_61 → th_phangnga
UPDATE cities SET prefecture_id = 'th_phangnga' WHERE prefecture_id = 'th_61';
UPDATE machi SET prefecture_id = 'th_phangnga' WHERE prefecture_id = 'th_61';
UPDATE prefectures SET id = 'th_phangnga' WHERE id = 'th_61';

-- th_62 → th_phuket
UPDATE cities SET prefecture_id = 'th_phuket' WHERE prefecture_id = 'th_62';
UPDATE machi SET prefecture_id = 'th_phuket' WHERE prefecture_id = 'th_62';
UPDATE prefectures SET id = 'th_phuket' WHERE id = 'th_62';

-- th_63 → th_krabi
UPDATE cities SET prefecture_id = 'th_krabi' WHERE prefecture_id = 'th_63';
UPDATE machi SET prefecture_id = 'th_krabi' WHERE prefecture_id = 'th_63';
UPDATE prefectures SET id = 'th_krabi' WHERE id = 'th_63';

-- th_64 → th_nakhon_si_thammarat
UPDATE cities SET prefecture_id = 'th_nakhon_si_thammarat' WHERE prefecture_id = 'th_64';
UPDATE machi SET prefecture_id = 'th_nakhon_si_thammarat' WHERE prefecture_id = 'th_64';
UPDATE prefectures SET id = 'th_nakhon_si_thammarat' WHERE id = 'th_64';

-- th_65 → th_trang
UPDATE cities SET prefecture_id = 'th_trang' WHERE prefecture_id = 'th_65';
UPDATE machi SET prefecture_id = 'th_trang' WHERE prefecture_id = 'th_65';
UPDATE prefectures SET id = 'th_trang' WHERE id = 'th_65';

-- th_66 → th_phatthalung
UPDATE cities SET prefecture_id = 'th_phatthalung' WHERE prefecture_id = 'th_66';
UPDATE machi SET prefecture_id = 'th_phatthalung' WHERE prefecture_id = 'th_66';
UPDATE prefectures SET id = 'th_phatthalung' WHERE id = 'th_66';

-- th_67 → th_satun
UPDATE cities SET prefecture_id = 'th_satun' WHERE prefecture_id = 'th_67';
UPDATE machi SET prefecture_id = 'th_satun' WHERE prefecture_id = 'th_67';
UPDATE prefectures SET id = 'th_satun' WHERE id = 'th_67';

-- th_68 → th_songkhla
UPDATE cities SET prefecture_id = 'th_songkhla' WHERE prefecture_id = 'th_68';
UPDATE machi SET prefecture_id = 'th_songkhla' WHERE prefecture_id = 'th_68';
UPDATE prefectures SET id = 'th_songkhla' WHERE id = 'th_68';

-- th_69 → th_pattani
UPDATE cities SET prefecture_id = 'th_pattani' WHERE prefecture_id = 'th_69';
UPDATE machi SET prefecture_id = 'th_pattani' WHERE prefecture_id = 'th_69';
UPDATE prefectures SET id = 'th_pattani' WHERE id = 'th_69';

-- th_70 → th_yala
UPDATE cities SET prefecture_id = 'th_yala' WHERE prefecture_id = 'th_70';
UPDATE machi SET prefecture_id = 'th_yala' WHERE prefecture_id = 'th_70';
UPDATE prefectures SET id = 'th_yala' WHERE id = 'th_70';

-- th_72 → th_yasothon
UPDATE cities SET prefecture_id = 'th_yasothon' WHERE prefecture_id = 'th_72';
UPDATE machi SET prefecture_id = 'th_yasothon' WHERE prefecture_id = 'th_72';
UPDATE prefectures SET id = 'th_yasothon' WHERE id = 'th_72';

-- th_73 → th_nakhon_phanom
UPDATE cities SET prefecture_id = 'th_nakhon_phanom' WHERE prefecture_id = 'th_73';
UPDATE machi SET prefecture_id = 'th_nakhon_phanom' WHERE prefecture_id = 'th_73';
UPDATE prefectures SET id = 'th_nakhon_phanom' WHERE id = 'th_73';

-- th_74 → th_prachin_buri
UPDATE cities SET prefecture_id = 'th_prachin_buri' WHERE prefecture_id = 'th_74';
UPDATE machi SET prefecture_id = 'th_prachin_buri' WHERE prefecture_id = 'th_74';
UPDATE prefectures SET id = 'th_prachin_buri' WHERE id = 'th_74';

-- th_75 → th_ubon_ratchathani
UPDATE cities SET prefecture_id = 'th_ubon_ratchathani' WHERE prefecture_id = 'th_75';
UPDATE machi SET prefecture_id = 'th_ubon_ratchathani' WHERE prefecture_id = 'th_75';
UPDATE prefectures SET id = 'th_ubon_ratchathani' WHERE id = 'th_75';

-- th_76 → th_udon_thani
UPDATE cities SET prefecture_id = 'th_udon_thani' WHERE prefecture_id = 'th_76';
UPDATE machi SET prefecture_id = 'th_udon_thani' WHERE prefecture_id = 'th_76';
UPDATE prefectures SET id = 'th_udon_thani' WHERE id = 'th_76';

-- th_77 → th_amnat_charoen
UPDATE cities SET prefecture_id = 'th_amnat_charoen' WHERE prefecture_id = 'th_77';
UPDATE machi SET prefecture_id = 'th_amnat_charoen' WHERE prefecture_id = 'th_77';
UPDATE prefectures SET id = 'th_amnat_charoen' WHERE id = 'th_77';

-- th_78 → th_mukdahan
UPDATE cities SET prefecture_id = 'th_mukdahan' WHERE prefecture_id = 'th_78';
UPDATE machi SET prefecture_id = 'th_mukdahan' WHERE prefecture_id = 'th_78';
UPDATE prefectures SET id = 'th_mukdahan' WHERE id = 'th_78';

-- th_79 → th_nong_bua_lamphu
UPDATE cities SET prefecture_id = 'th_nong_bua_lamphu' WHERE prefecture_id = 'th_79';
UPDATE machi SET prefecture_id = 'th_nong_bua_lamphu' WHERE prefecture_id = 'th_79';
UPDATE prefectures SET id = 'th_nong_bua_lamphu' WHERE id = 'th_79';

-- th_80 → th_sa_kaeo
UPDATE cities SET prefecture_id = 'th_sa_kaeo' WHERE prefecture_id = 'th_80';
UPDATE machi SET prefecture_id = 'th_sa_kaeo' WHERE prefecture_id = 'th_80';
UPDATE prefectures SET id = 'th_sa_kaeo' WHERE id = 'th_80';

-- th_81 → th_bueng_kan
UPDATE cities SET prefecture_id = 'th_bueng_kan' WHERE prefecture_id = 'th_81';
UPDATE machi SET prefecture_id = 'th_bueng_kan' WHERE prefecture_id = 'th_81';
UPDATE prefectures SET id = 'th_bueng_kan' WHERE id = 'th_81';

-- ===============================
-- 6. 外部キー制約を再作成
-- ===============================
ALTER TABLE cities ADD CONSTRAINT cities_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES prefectures(id);
ALTER TABLE machi ADD CONSTRAINT machi_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES prefectures(id);
-- transport_hubs の制約は存在する場合のみ追加
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transport_hubs' AND column_name = 'prefecture_id') THEN
    ALTER TABLE transport_hubs ADD CONSTRAINT transport_hubs_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES prefectures(id);
  END IF;
END $$;
