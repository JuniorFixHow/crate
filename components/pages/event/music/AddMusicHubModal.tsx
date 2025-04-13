import {Modal} from '@mui/material';
import '@/components/features/customscroll.css';
import { Dispatch, SetStateAction, useState } from 'react';
import SearchSelectMultipleMusicHubs from '@/components/features/SearchSelectMultipleMusicHubs';
import AddButton from '@/components/features/AddButton';
import { enqueueSnackbar } from 'notistack';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { IMusichub } from '@/lib/database/models/musichub.model';
import { addMusicHubToEvent } from '@/lib/actions/musichub.action';
import Subtitle from '@/components/features/Subtitle';

type AddMusicHubModalProps = {
  selectMode:boolean;
  setSelectMode:Dispatch<SetStateAction<boolean>>;
  eventId:string;
  reload: (options?: RefetchOptions) => Promise<QueryObserverResult<IMusichub[], Error>>;
}

const AddMusicHubModal = ({selectMode, reload, eventId, setSelectMode}:AddMusicHubModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<string[]>([]);
  const handleClose = ()=>{
    setSelectMode(false);
    setSelection([]);
  }

  const handleAddToEvent = async()=>{
    try {
      setLoading(true);
      const res = await addMusicHubToEvent(selection, eventId);
      enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
      reload();
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured assigning musicians to the event', {variant:'error'})
    }finally{
      setSelectMode(false);
      setLoading(false);
    }
  }

  return (
    <Modal
    open={selectMode}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    className='flex size-full'
>
  <div className="flex size-full items-center justify-center">
    <div className="new-modal overflow-y-scroll scrollbar-custom2">
      <div className="flex flex-col gap-5">
        <Subtitle text='Assign musicians to event' />
        <SearchSelectMultipleMusicHubs width={300} setSelection={setSelection} />
        <div className="flex flex-col gap-4 md:flex-row">
          {
            selection.length > 0 &&
            <AddButton onClick={handleAddToEvent} noIcon smallText disabled={loading} text={loading ? 'loading...':'Proceed'} type='button' className='rounded justify-center py-1' />
          }
          <AddButton onClick={handleClose} noIcon smallText isCancel text='Cancel' type='button' className='rounded justify-center py-1' />
        </div>
      </div>
    </div>
  </div>
    </Modal>
  )
}

export default AddMusicHubModal